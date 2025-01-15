import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="card">
      <div class="card-header text-center">
        <h3 class="mb-0">SMS Decrypt</h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="inputField" class="form-label">Şifrelenmiş Değer:</label>
          <input type="text" class="form-control" id="inputField" placeholder="Şifrelenmiş değeri giriniz">
        </div>
        <button id="submitBtn" class="btn btn-primary">İstek Gönder</button>
        <div id="resultArea" class="mt-4"></div>
      </div>
      <div class="card-footer text-muted text-center">
        <small>Prepared by Alp | Gulay S. sms istemesin diye yapilmistir.</small>
      </div>
    </div>
  </div>
`

async function sendRequest() {
    const api1Url = 'https://omni-zone-uat.turktelekom.com.tr/OdfCommerceBackendTtgTest2/auth'
    const api2Url = 'https://omni-zone-uat.turktelekom.com.tr/OdfCommerceBackendTtgTest2/marvel/admin/utility/crypto/decrypt'
    const inputValue = document.getElementById('inputField').value
    const loginBody = {
        "userName": "Etiya_Admin",
        "password": "aa1234"
    }

    try {
        // Loading durumunu göster
        document.getElementById('submitBtn').disabled = true
        document.getElementById('submitBtn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> İşleniyor...'

        const response1 = await fetch(api1Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody)
        })
        if (!response1.ok) {
            throw new Error('Login API request failed')
        }
        const authToken = response1.headers.get('authorization')
        if (!authToken) {
            throw new Error('Authorization token not found')
        }

        const response2 = await fetch(api2Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
                'LocalToken': '1'
            },
            body: JSON.stringify({ value: inputValue })
        })
        if (!response2.ok) {
            throw new Error('Decrypt API request failed')
        }
        const result = await response2.json()

        // Sonucu daha güzel göster
        const resultDiv = document.getElementById('resultArea')
        resultDiv.innerHTML = `<div class="alert alert-success">
            <h5>Şifre Çözüldü:</h5>
            <pre class="mb-0">${JSON.stringify(result, null, 2)}</pre>
        </div>`
    } catch (error) {
        const resultDiv = document.getElementById('resultArea')
        resultDiv.innerHTML = `<div class="alert alert-danger">
            <strong>Hata:</strong> ${error.message}
        </div>`
    } finally {
        // Butonu normal haline getir
        document.getElementById('submitBtn').disabled = false
        document.getElementById('submitBtn').innerHTML = 'İstek Gönder'
    }
}

// Event listener ekle
document.getElementById('submitBtn').addEventListener('click', sendRequest)