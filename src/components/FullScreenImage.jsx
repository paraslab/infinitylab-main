export default function FullScreenImage({ src, alt }) {
  return (
    <section className="w-screen  overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </section>
  );
}
