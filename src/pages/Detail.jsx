import { useParams } from 'react-router-dom';

export default function Detail() {
  const { id } = useParams();
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-6">Detalle de Carta</h1>
      <p className="text-slate-400">Viendo la información de la carta con ID: <span className="text-blue-400">{id}</span></p>
    </div>
  );
}
