// Pie de pagina simple
import './PiePagina.css';

function PiePagina() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="pie-pagina">
      <div className="contenedor">
        <p>Vellacci {anioActual} - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default PiePagina;
