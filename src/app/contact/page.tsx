'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/auth-context';

export default function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        userId: user?.uid || null,
        timestamp: new Date().toISOString(),
      });
      
      setSent(true);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 my-10">
      <h1 className="text-3xl font-bold mb-8">Contacto</h1>
      
      {sent ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Mensaje enviado correctamente. Te responderemos lo antes posible.</p>
          <button 
            onClick={() => setSent(false)} 
            className="text-green-700 underline mt-2"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={sending}
              className="bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}