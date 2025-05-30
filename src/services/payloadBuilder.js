// src/utils/payloadBuilder.js
import { COURIER_EVENTS } from './courierEvents.js';

export function createCourierPayload(eventKey, tid, customerOrder) {
  const event = COURIER_EVENTS[eventKey];
  if (!event) {
    throw new Error('Bilinmeyen event: ' + eventKey);
  }

  const now = new Date().toISOString(); // anlık tarih saat

  return {
    reqInfo: {
      transactionId: tid
    },
    event: {
      shipmentOrder: {
        relatedParty: [
          {
            id: '',
            role: '',
            name: ''
          }
        ],
        orderItem: [
          {
            shipment: {
              shipmentItem: [
                {
                  resource: {
                    characteristic: [
                      {
                        name: '',
                        value: ''
                      }
                    ],
                    note: [
                      {
                        id: '',
                        text: ''
                      }
                    ]
                  }
                }
              ]
            },
            id: customerOrder
          }
        ],
        id: customerOrder,
        state: event.state,
        trackingDetails: [
          {
            id: '',
            carrierTrackingUrl: '',
            status: event.status,
            statusID: event.statusID,
            statusChangeDate: now
          }
        ]
      }
    }
  };
}
