import mercadopago from "mercadopago";
import fetch from "node-fetch";

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

export async function handler(event) {
  const action = event.queryStringParameters.action;
  const body = event.body ? JSON.parse(event.body) : {};

  // 🔹 CRIAR PIX
  if (action === "criar_pix") {
    const payment = await mercadopago.payment.create({
      transaction_amount: 10,
      payment_method_id: "pix",
      description: "Compra de seguidores",
      metadata: body
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        pix: payment.body.point_of_interaction.transaction_data.qr_code,
        payment_id: payment.body.id
      })
    };
  }

  // 🔹 WEBHOOK PIX
  if (action === "webhook") {
    const data = JSON.parse(event.body);

    if (data.action === "payment.updated") {
      // Aqui você buscaria o pagamento aprovado
      // e chamaria o SMM automaticamente
    }

    return { statusCode: 200 };
  }

  // 🔹 CRIAR PEDIDO SMM
  if (action === "criar_smm") {
    const res = await fetch("https://wassmm.online/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.WASSMM_API_KEY,
        action: "add",
        service: body.service,
        link: body.link,
        quantity: body.quantity
      })
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  return { statusCode: 400 };
}
