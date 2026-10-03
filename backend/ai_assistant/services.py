import json

from django.conf import settings
from google import genai
from google.genai import types
from groq import Groq
from pydantic import BaseModel


# =========================================================
# RESPONSE SCHEMA
# =========================================================

class RuralKartAIResponse(BaseModel):
    answer: str
    product_ids: list[int]


# =========================================================
# AI CLIENTS
# =========================================================

gemini_client = None
groq_client = None


if settings.GEMINI_API_KEY:
    gemini_client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )


if settings.GROQ_API_KEY:
    groq_client = Groq(
        api_key=settings.GROQ_API_KEY
    )


# =========================================================
# PRODUCT CONTEXT
# =========================================================

def build_product_context(products):
    return "\n".join(
        [
            (
                f"ID: {product.id}\n"
                f"Name: {product.name}\n"
                f"Price: ₹{product.price}\n"
                f"Category: "
                f"{product.category.name if product.category else 'Uncategorized'}\n"
                f"Description: "
                f"{product.description or 'No description'}\n"
                f"Stock: {product.stock_quantity}\n"
            )
            for product in products
        ]
    )


# =========================================================
# PROMPT
# =========================================================

def build_prompt(user_message, product_context):
    return f"""
You are RuralKart AI, a helpful shopping assistant for RuralKart.

RuralKart is an Indian marketplace for:
- rural products
- handcrafted products
- traditional products
- artisan products
- eco-friendly products

Help customers discover products and understand how to use
the RuralKart shopping platform.

Customer message:
{user_message}

Available RuralKart products:
{product_context}

IMPORTANT RULES:

1. Only recommend products from the provided product list.

2. Never invent product IDs.

3. If no product is relevant, return an empty product_ids array.

4. Keep the answer short, natural, and helpful.

5. For product recommendations, select the most relevant products.

6. If the customer asks about checkout, cart, payment,
   orders, or how RuralKart works, explain the process clearly.

Return the response using the required JSON structure.
"""


# =========================================================
# GEMINI
# =========================================================

def ask_gemini(prompt):

    if not gemini_client:
        raise RuntimeError(
            "Gemini API key is not configured."
        )

    response = gemini_client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RuralKartAIResponse,
        ),
    )

    result = RuralKartAIResponse.model_validate_json(
        response.text
    )

    return result.model_dump()


# =========================================================
# GROQ FALLBACK
# =========================================================

def ask_groq(prompt):

    if not groq_client:
        raise RuntimeError(
            "Groq API key is not configured."
        )

    completion = groq_client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are RuralKart AI. "
                    "Return only valid JSON with "
                    "answer and product_ids fields."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.4,
        max_tokens=400,
        response_format={
            "type": "json_object"
        },
    )

    text = completion.choices[0].message.content

    if not text:
        raise RuntimeError(
            "Groq returned an empty response."
        )

    return json.loads(text)


# =========================================================
# MAIN AI FUNCTION
# =========================================================

def ask_ruralkart_ai(user_message, products):

    product_context = build_product_context(products)

    prompt = build_prompt(
        user_message=user_message,
        product_context=product_context,
    )

    # -----------------------------------------------------
    # 1. Gemini
    # -----------------------------------------------------

    try:

        result = ask_gemini(prompt)

        return {
            "answer": result.get("answer", ""),
            "product_ids": result.get("product_ids", []),
            "provider": "gemini",
        }

    except Exception as gemini_error:

        if settings.DEBUG_AI:
            print(
                "Gemini AI error:",
                repr(gemini_error)
            )

    # -----------------------------------------------------
    # 2. Groq fallback
    # -----------------------------------------------------

    try:

        result = ask_groq(prompt)

        return {
            "answer": result.get("answer", ""),
            "product_ids": result.get("product_ids", []),
            "provider": "groq",
        }

    except Exception as groq_error:

        if settings.DEBUG_AI:
            print(
                "Groq AI error:",
                repr(groq_error)
            )

    # -----------------------------------------------------
    # 3. Both failed
    # -----------------------------------------------------

    return {
        "answer": (
            "I'm temporarily unable to access the AI assistant. "
            "You can still browse products using search "
            "and categories."
        ),
        "product_ids": [],
        "provider": None,
    }