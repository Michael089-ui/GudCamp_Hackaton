
import React, { useState } from 'react';
import { XMarkIcon, DocumentArrowDownIcon, ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface DownloadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadPdfModal: React.FC<DownloadPdfModalProps> = ({ isOpen, onClose }) => {
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsAppStatus, setWhatsAppStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    console.log("Iniciando descarga del PDF: 'Entendiendo tu crédito del campo.pdf'");
    // LÓGICA DE DESCARGA
    // En una aplicación real, esto apuntaría a la URL del PDF generado.
    // Ejemplo: window.location.href = 'download_url_del_pdf';
    alert("Iniciando la descarga del PDF...");
    onClose();
  };
  
  const handleSendWhatsApp = async () => {
    if (phoneNumber.length < 10) {
        setWhatsAppStatus('error');
        return;
    }
    setWhatsAppStatus('sending');
    console.log(`Simulando envío de PDF a ${phoneNumber} a nombre de Gud Camp...`);

    // SIMULACIÓN DE LLAMADA API
    // Aquí iría la llamada a un servicio de envío de WhatsApp.
    // await enviar_whatsapp(phoneNumber, 'download_url_del_pdf');
    setTimeout(() => {
        setWhatsAppStatus('success');
        // Cerrar modal tras mostrar el mensaje de éxito
        setTimeout(() => {
            onClose();
            // Resetear estado para la próxima vez que se abra
            setShowWhatsAppInput(false);
            setPhoneNumber('');
            setWhatsAppStatus('idle');
        }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Cerrar modal">
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="text-brand-green mx-auto bg-brand-green-light w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <DocumentArrowDownIcon className="h-8 w-8"/>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-slate-800 font-heading">¡Tu simulación de crédito está lista!</h2>
        <p className="text-slate-600 mb-6">
          Ahora puedes descargar un PDF detallado llamado 'Entendiendo tu crédito del campo' con todos los resultados de tu simulación y la información clave.
        </p>

        {!showWhatsAppInput ? (
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={handleDownloadPdf}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-brand-gold hover:from-brand-green-dark hover:to-brand-gold-dark text-white font-bold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] font-heading">
                    <DocumentArrowDownIcon className="h-5 w-5"/>
                    Descargar PDF Ahora
                </button>
                <button
                    onClick={() => { setShowWhatsAppInput(true); setWhatsAppStatus('idle'); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-brand-dark font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors shadow-md hover:shadow-lg font-heading">
                    <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                    Recibir por WhatsApp
                </button>
            </div>
        ) : (
            <div className="mt-4 animate-fadeIn">
                <label htmlFor="phoneNumber" className="block text-slate-700 font-bold mb-2 font-heading">Ingresa tu número de teléfono móvil</label>
                <div className="flex gap-2">
                    <input 
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ej: 3001234567"
                        className="w-full p-3 border rounded-xl"
                    />
                    <button onClick={handleSendWhatsApp} disabled={whatsAppStatus === 'sending'} className="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded-xl transition-colors disabled:bg-slate-400 flex items-center justify-center">
                        <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                </div>
                {whatsAppStatus === 'sending' && <p className="text-sky-600 mt-2">Enviando...</p>}
                {whatsAppStatus === 'success' && <p className="text-green-600 mt-2">¡Enviado! Revisa tus mensajes de WhatsApp.</p>}
                {whatsAppStatus === 'error' && <p className="text-red-500 mt-2">Por favor, ingresa un número válido.</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPdfModal;
