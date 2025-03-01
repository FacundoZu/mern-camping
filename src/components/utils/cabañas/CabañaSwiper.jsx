import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const CabañaSwiper = ({ cabaña }) => {
    if (!cabaña || !cabaña.imagenPrincipal) {
        return <div>No hay imágenes disponibles para mostrar.</div>;
    }

    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className='h-[600px] justify-center flex items-center text-center shadow-lg mb-2'
        >
            <SwiperSlide>
                <img src={cabaña.imagenPrincipal} className='w-full h-[600px] object-cover' alt="Imagen principal de la cabaña" />
            </SwiperSlide>

            {cabaña.imagenes && cabaña.imagenes.map((imagen, index) => (
                <SwiperSlide key={index}>
                    <img src={imagen} className='w-full h-[600px] object-cover' alt={`Imagen adicional ${index + 1}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
