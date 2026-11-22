import { Helmet } from "react-helmet-async";

const DOMAIN = "https://savitramfoundation.com/bhawishya-dwar";
const LOGO = `https://savitramfoundation.com/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png`;

export default function SeoHead({
  title = "AI Palm Reading & Astrology Online | SAVITRAM Foundation Bhawishya Dwar",
  description = "Explore AI palm reading, palm line interpretations, astrology and personalized horoscope insights with SAVITRAM Foundation Bhawishya Dwar. Discover traditional palmistry in Hindi and English.",
  keywords = "AI Palm Reading, Online Palm Reading, AI Palmistry, Palm Reading Online Free, Palm Line Reading, Life Line Palm Reading, Heart Line Palm Reading, Head Line Palm Reading, Fate Line Palm Reading, AI Astrology, Online Horoscope, Astrology AI, Palm Reading in Hindi, AI Palm Reader, SAVITRAM Foundation, Bhawishya Dwar",
  canonical = "/",
  ogTitle = "SAVITRAM Foundation Bhawishya Dwar – Discover Your Palm with AI-Powered Palmistry",
  ogDescription = "Explore traditional palmistry interpretations and astrology insights with SAVITRAM Foundation Bhawishya Dwar.",
  noIndex = false,
  schema = null,
}) {
  const canonicalUrl = `${DOMAIN}${canonical}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="language" content="English, Hindi" />
      <meta name="author" content="SAVITRAM Foundation" />
      <meta name="theme-color" content="#641A78" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={LOGO} />
      <meta property="og:image:alt" content="SAVITRAM Foundation Bhawishya Dwar – Palmistry & Astrology Logo" />
      <meta property="og:site_name" content="SAVITRAM Foundation Bhawishya Dwar" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={LOGO} />
      <meta name="twitter:creator" content="@SAVITRAMFoundation" />

      {/* Alternate Languages / hreflang for GEO and Global Crawlers */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Structured Data JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
