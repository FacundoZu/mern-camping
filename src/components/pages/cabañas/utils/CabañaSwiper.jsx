import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const CabañaSwiper = ({ cabaña }) => {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            }}
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
            <div className="swiper-button-prev swiper-button-prev-custom text-lime-400 hover:text-lime-500"></div>
            <div className="swiper-button-next swiper-button-next-custom text-lime-400 hover:text-lime-500"></div>
        </Swiper>
    );
};

