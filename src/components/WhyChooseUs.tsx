import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#eaf6fb] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-sm text-neutral-500 sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-md border border-neutral-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <Image
                src={feature.icon}
                alt=""
                width={32}
                height={32}
                className="size-7 sm:size-8"
              />
              <h3 className="mt-4 text-lg font-medium text-neutral-900 sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
