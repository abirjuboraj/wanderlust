"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CarouselButtons from "@/components/CarouselButtons";

const testimonials = [
  {
    id: 1,
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    id: 2,
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
  },
  {
    id: 3,
    quote:
      "From The Desert Dunes Of Dubai To The Bustling Souks, Everything Was Flawlessly Organized. The Attention To Detail Made This Trip Feel Truly Personal.",
    name: "David Anderson",
    location: "London, UK",
    image: "/images/person2.png",
  },
  {
    id: 4,
    quote:
      "A Seamless Journey From Start To Finish. The Itinerary Balanced Adventure And Relaxation Perfectly, And The Local Food Tours Were An Absolute Highlight.",
    name: "Emily Carter",
    location: "Melbourne, Australia",
    image: "/images/person1.png",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-10">
        <Carousel opts={{ align: "start", loop: false }}>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                What Travelers Say
              </h2>
              <p className="mt-3 text-sm text-neutral-500 sm:text-base">
                Real experiences from our happy travelers
              </p>
            </div>
            <CarouselButtons />
          </div>

          <CarouselContent className="mt-8 sm:mt-10">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-[85%] sm:basis-1/2"
              >
                <article className="flex h-full flex-col-reverse gap-5 rounded-md border border-neutral-200 bg-white p-5 sm:flex-row sm:p-6">
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm leading-relaxed text-neutral-700">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="mt-auto pt-6">
                      <p className="text-sm font-medium text-[#29abe2]">
                        &mdash; {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-sm bg-muted sm:h-auto sm:w-32 lg:w-40">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="(min-width: 640px) 160px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
