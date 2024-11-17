import React from 'react';

const Mapa = () => {
    return (
        <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5108.728927167168!2d-66.17071144597938!3d-25.12159360142212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941c1e42ddb15d41%3A0x9803b9f8f8c718e!2sCamping%20Municipal%20de%20Cachi!5e0!3m2!1ses-419!2sar!4v1731866080054!5m2!1ses-419!2sar"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default Mapa;