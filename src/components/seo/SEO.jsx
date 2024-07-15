import { Helmet } from 'react-helmet-async';

function SEO({title, description, name, url, imageUrl}) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />

            <meta name="twitter:card" content="website" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            <link rel="canonical" href={url} />
        </Helmet>
    )
}

export default SEO;