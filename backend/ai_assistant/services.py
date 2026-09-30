import requests
import json
from django.conf import settings

HF_API_URL = f"https://api-inference.huggingface.co/models/{settings.HF_MODEL}"
HF_HEADERS = {"Authorization": f"Bearer {settings.HF_TOKEN}"}

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
"""

    try:
        resp = requests.post(HF_API_URL, headers=HF_HEADERS, json={"inputs": prompt}, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        # Hugging Face returns a list of dicts with 'generated_text'
        if isinstance(data, list) and "generated_text" in data[0]:
            text = data[0]["generated_text"].strip()
        else:
            text = str(data)

        try:
            parsed = json.loads(text)
            return {
                "answer": parsed.get("answer", ""),
                "product_ids": parsed.get("product_ids", []),
            }
        except json.JSONDecodeError:
            return {"answer": text, "product_ids": []}

    except requests.exceptions.RequestException as e:
        return {"answer": f"Error contacting AI service: {e}", "product_ids": []}
