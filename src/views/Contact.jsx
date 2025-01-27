function Contact() {
    return (
        <section id="contact" className="contact">
            <div className="container">
                <h2>Contacto</h2>
                <p className="align-center">
                    ¿Tienes preguntas? Contáctanos y estaremos encantados de
                    ayudarte.
                </p>
                <form className="contact-form">
                    <input type="text" placeholder="Nombre" />
                    <input type="email" placeholder="Correo Electrónico" />
                    <textarea placeholder="Tu Mensaje"></textarea>
                    <button type="submit" className="btn-primary">
                        Enviar
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Contact;
