import React, { useEffect, useMemo } from "react"; // useMemo added
import { useParams, Link, useLocation } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar";
import { Loader2, ServerCrash, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPostBySlug,
  clearCurrentPost,
} from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";

// --- SOCIAL ICONS (SVG) ---
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" /></svg>
);
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.48 3.4 1.35 4.85L2 22l5.42-1.47c1.41.82 3 1.29 4.62 1.29 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.91-.41-4.15-1.16l-.3-.18-3.08.83.85-3.01-.2-.32c-.82-1.3-1.26-2.81-1.26-4.39 0-4.54 3.72-8.24 8.26-8.24s8.26 3.7 8.26 8.24-3.72 8.24-8.26 8.24zm4.52-6.19c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94s-.28.18-.52.06c-.24-.12-1.02-.38-1.94-1.2-1.03-.9-1.5-1.88-1.68-2.2v-.02c-.18-.32-.04-.5.1-.64.12-.12.26-.32.4-.42.12-.12.16-.2.24-.34s.04-.28-.02-.4c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.47c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.32 1 2.48.12.16 1.67 2.55 4.05 3.56.58.24 1.05.38 1.41.48.58.16 1.11.14 1.52.08.45-.06 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28z" /></svg>
);
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 7.15l-1.5 7.07c-.11.49-.4.61-.81.38l-2.26-1.67-1.09 1.05c-.12.12-.23.23-.47.23l.17-2.42 4.41-3.99c.19-.17-.04-.27-.29-.1l-5.45 3.43-2.35-.74c-.51-.16-.52-.51.11-.75l9.19-3.55c.43-.16.81.1.67.75z" /></svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
);
const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" /></svg>
);
const ThreadsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" /><path d="M4 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" /><path d="M8 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" /></svg>
);

const SingleBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { post, status, error } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  // --- LOADING STATE ---
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-soft-teal">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (status === "failed" || !post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | HousePlanFiles</title>
          <meta
            name="description"
            content="The blog post you are looking for could not be found."
          />
        </Helmet>
        <Navbar />
        <div className="bg-soft-teal min-h-screen flex flex-col items-center justify-center text-center p-4">
          <ServerCrash className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-4xl font-bold text-foreground">Post Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            {String(error) ||
              "The blog post you are looking for does not exist or may have been moved."}
          </p>
          <Button asChild className="mt-6">
            <Link to="/blogs">Back to All Blogs</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  // --- LOGIC FOR SHARING PREVIEW (Matching ProductDetail.tsx) ---
  const backendApiUrl =
    import.meta.env.VITE_BACKEND_URL || "https://architect-backend.vercel.app";
  
  // This logic is crucial for Facebook/WhatsApp to see the image
  const absoluteImageUrl = post.mainImage?.startsWith("http")
    ? post.mainImage
    : `${backendApiUrl}${post.mainImage}`;

  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  // --- KEY CHANGE: Use the Backend Share URL like ProductDetail.tsx ---
  // This forces the scraper to hit the backend first, which serves the meta tags.
  const cacheBuster = `?v=${new Date().getTime()}`;
  
  // NOTE: Aapko backend me '/share/blog/:slug' route handle karna padega,
  // same jaise aapne product ke liye kiya hai.
  const shareUrl = `${backendApiUrl}/share/blog/${slug}${cacheBuster}`;

  const encodedUrl = encodeURIComponent(shareUrl); // Sharing the backend link
  const encodedTitle = encodeURIComponent(post.title);
  const encodedImage = encodeURIComponent(absoluteImageUrl);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-blue-800",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "bg-green-500",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      color: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedinIcon />,
      color: "bg-sky-700",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      color: "bg-red-600",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      color: "bg-sky-500",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Threads",
      icon: <ThreadsIcon />,
      color: "bg-black",
      href: `https://www.threads.net/share?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${post.title} | HousePlanFiles`}</title>
        <meta
          name="description"
          content={post.metaDescription || post.description}
        />
        <meta
          name="keywords"
          content={post.metaKeywords?.join(", ") || post.tags?.join(", ")}
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* --- Open Graph Data for Social Preview --- */}
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.description}
        />
        {/* Ensures image shows up on WhatsApp/FB */}
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:image:secure_url" content={absoluteImageUrl} /> 
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:author" content={post.author} />
        {post.tags?.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

        {/* --- Twitter Card Data --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.metaDescription || post.description}
        />
        <meta name="twitter:image" content={absoluteImageUrl} />
      </Helmet>

      <Navbar />
      <div className="bg-soft-teal py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
            {/* Main Blog Content Area */}
            <main className="w-full lg:w-2/3 bg-card p-6 sm:p-8 rounded-2xl shadow-soft">
              <article>
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
                    {post.title}
                  </h1>
                  <div className="flex items-center text-muted-foreground text-sm space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5" />
                      <span>By {post.author}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={absoluteImageUrl}
                    alt={post.imageAltText || post.title}
                    title={post.imageTitleText || post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div
                  className="prose lg:prose-lg max-w-none text-foreground space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              {/* --- SHARE SECTION --- */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 text-lg">
                  Share this post
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {socialPlatforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Share on ${p.name}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-white ${p.color} transition-opacity hover:opacity-80 shadow-sm`}
                    >
                      {p.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Comment Form Removed for brevity - same as before */}
              <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Leave a Comment
                </h2>
                {/* ... existing comment form code ... */}
                <form className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <div>
                    <textarea
                      placeholder="Your comment..."
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name *"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </section>
            </main>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleBlogPostPage;
