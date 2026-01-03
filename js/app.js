async function pagar() {
const res = await fetch('/.netlify/functions/criar-pix', {
method: 'POST',
body: JSON.stringify({ valor: 10.00 })
});


const data = await res.json();


document.getElementById('pix').innerHTML = `
<p>Copie e cole:</p>
<textarea>${data.copia_e_cola}</textarea>
<img src="${data.qr_code}" />
`;
  }
