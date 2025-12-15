import React, { useEffect } from "react";
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

/* ================= ICONS ================= */

const FacebookIcon = () => <span>📘</span>;
const WhatsAppIcon = () => <span>🟢</span>;
const TwitterIcon = () => <span>❌</span>;
const LinkedinIcon = () => <span>🔗</span>;
const PinterestIcon = () => <span>📌</span>;
const TelegramIcon = () => <span>✈️</span>;
const ThreadsIcon = () => <span>🧵</span>;

/* ================= PAGE ================= */

const SingleBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { post, status, error } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (slug) dispatch(fetchPostBySlug(slug));
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  /* ================= STATES ================= */

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin" />
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
        </Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <ServerCrash className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p>{String(error)}</p>
          <Button asChild className="mt-6">
            <Link to="/blog">Back to Blogs</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  /* ================= URLS ================= */

  const backendApiUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "https://architect-backend.vercel.app";

  const absoluteImageUrl = post.mainImage?.startsWith("http")
    ? post.mainImage
    : `${backendApiUrl}${post.mainImage}`;

  // ✅ FRONTEND CANONICAL URL
  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  // ✅ SHARE URL = FRONTEND ONLY (MAIN FIX)
  const shareUrl = `${window.location.origin}/blog/${slug}`;

  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedImage = encodeURIComponent(absoluteImageUrl);

  /* ================= SOCIAL LINKS ================= */

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedShareUrl}`,
    },
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedinIcon />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}&title=${encodedTitle}`,
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      href: `https://pinterest.com/pin/create/button/?url=${encodedShareUrl}&media=${encodedImage}&description=${encodedTitle}`,
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      href: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedTitle}`,
    },
    {
      name: "Threads",
      icon: <ThreadsIcon />,
      href: `https://www.threads.net/share?url=${encodedShareUrl}&text=${encodedTitle}`,
    },
  ];

  /* ================= RENDER ================= */

  return (
    <>
      <Helmet>
        <title>{post.title} | HousePlanFiles</title>
        <meta
          name="description"
          content={post.metaDescription || post.description}
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* OG TAGS */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.description}
        />
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:url" content={canonicalUrl} />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.metaDescription || post.description}
        />
        <meta name="twitter:image" content={absoluteImageUrl} />
      </Helmet>

      <Navbar />

      <div className="container mx-auto py-12 flex gap-10">
        <main className="w-full lg:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex gap-4 text-sm mb-6">
            <span className="flex items-center gap-1">
              <User size={14} /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <img
            src={absoluteImageUrl}
            alt={post.title}
            className="rounded-xl mb-8"
          />

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* SHARE */}
          <div className="mt-10 border-t pt-6">
            <h3 className="font-bold mb-3">Share this post</h3>
            <div className="flex gap-2">
              {socialPlatforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 border rounded"
                >
                  {p.icon}
                </a>
              ))}
            </div>
          </div>
        </main>

        <BlogSidebar />
      </div>

      <Footer />
    </>
  );
};

export default SingleBlogPostPage;
