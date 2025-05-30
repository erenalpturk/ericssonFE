import React, { useState } from 'react';
import axios from 'axios';

import { COURIER_EVENTS } from '../services/courierEvents';
import { createCourierPayload } from '../services/payloadBuilder';
import { API_CONFIG } from '../services/config';

const CourierActions = ({ onApiCall }) => {
  const [environment, setEnvironment] = useState('regresyon');
  const [tid, setTid] = useState('');
  const [customerOrder, setCustomerOrder] = useState('');

  const sendRequest = async (eventKey) => {
    try {
      const payload = createCourierPayload(eventKey, tid, customerOrder);
      const baseUrl = API_CONFIG[environment].baseUrl;
      const url = baseUrl + COURIER_EVENTS[eventKey].endpoint;

      const response = await axios.post(url, payload);
      onApiCall && onApiCall(`Başarılı: ${eventKey} gönderildi.`);
      alert('Başarılı: ' + JSON.stringify(response.data));
    } catch (error) {
      onApiCall && onApiCall(`Hata: ${error.message}`);
      alert('Hata: ' + error.message);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Kurye Event Gönderimi</h2>

      <form>
        <div className="mb-3">
          <label htmlFor="environmentSelect" className="form-label">Ortam Seç</label>
          <select
            id="environmentSelect"
            className="form-select"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="regresyon">Regresyon</option>
            <option value="fonksiyonel">Fonksiyonel</option>
            <option value="hotfix">Hotfix</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="tidInput" className="form-label">TID</label>
          <input
            id="tidInput"
            type="text"
            className="form-control"
            value={tid}
            onChange={(e) => setTid(e.target.value)}
            placeholder="Transaction ID"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="customerOrderInput" className="form-label">Müşteri Sipariş No</label>
          <input
            id="customerOrderInput"
            type="text"
            className="form-control"
            value={customerOrder}
            onChange={(e) => setCustomerOrder(e.target.value)}
            placeholder="customerOrder"
          />
        </div>

        <hr />

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('KuryeAtandi')}
          >
            Kurye Atandı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('RandevuOnaylandi')}
          >
            Randevu Onaylandı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('KuryeYolaCikti')}
          >
            Kurye Yola Çıktı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('KuryeUlasti')}
          >
            Kurye Ulaştı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('SozlesmeOnayIslemiBasladi')}
          >
            Sözleşme Onay Başladı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('AcikRizaMetniOnayiBekliyor')}
          >
            Açık Rıza Onayı Bekliyor
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('AcikRizaMetniOnaylandi')}
          >
            Açık Rıza Onaylandı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('SmsDogrulamaBekliyor')}
          >
            SMS Doğrulama Bekliyor
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('SmsDogrulamaTamamlandi')}
          >
            SMS Doğrulama Tamamlandı
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => sendRequest('KimlikDogrulamaBekliyor')}
          >
            Kimlik Doğrulama Bekliyor
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourierActions;
