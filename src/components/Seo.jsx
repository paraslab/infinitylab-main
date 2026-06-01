import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const Seo = ({ title, description, image, jsonLd }) => {
  const location = useLocation();

  const canonicalUrl = `https://www.infinityenergy.xyz${location.pathname}`;
  const ogImage =
    image || "https://www.infinityenergy.xyz/og-image.jpg";

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical (AUTO) */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
