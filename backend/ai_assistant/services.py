from django.conf import settings
from openai import OpenAI
import json


client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)


def ask_ruralkart_ai(user_message, products):
    product_context = "\n".join(
        [
            (
                f"ID: {product.id}\n"
                f"Name: {product.name}\n"
                f"Price: ₹{product.price}\n"
                f"Category: {product.category.name if product.category else 'Uncategorized'}\n"
                f"Description: {product.description or 'No description'}\n"
                f"Stock: {product.stock_quantity}\n"
            )
            for product in products
        ]
    )

    prompt = f"""
You are RuralKart AI, a helpful shopping assistant for RuralKart,
an Indian marketplace for rural, handcrafted, traditional and
eco-friendly products.

Customer message:
{user_message}

Available RuralKart products:
{product_context}

Return ONLY valid JSON in exactly this format:

{{
    "answer": "A short helpful response to the customer.",
    "product_ids": [1, 2]
}}

Rules:

1. Recommend ONLY products from the provided product list.
2. Never invent a product.
3. Never invent a price.
4. Never invent stock information.
5. Never recommend a product with stock 0.
6. product_ids must contain only IDs from the provided product list.
7. Recommend the best 1–3 matching products.
8. If nothing matches, return an empty product_ids array.
9. Keep the answer concise and conversational.
10. Prices are in Indian Rupees (INR).
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    text = response.output_text.strip()

    try:
        data = json.loads(text)

        return {
            "answer": data.get("answer", ""),
            "product_ids": data.get("product_ids", []),
        }

    except json.JSONDecodeError:
        return {
            "answer": text,
            "product_ids": [],
        }