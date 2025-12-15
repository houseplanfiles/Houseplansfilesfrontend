import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import { Helmet } from "react-helmet-async";
import { Calendar, User, Loader2, ServerCrash } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAllPosts, BlogPost } from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";

const BlogsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const { posts, status, error } = useSelector(
    (state: RootState) => state.blog
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllPosts());
    }
  }, [dispatch, status]);

  const backendApiUrl =
    import.meta.env.VITE_BACKEND_URL || "https://architect-backend.vercel.app";
  const siteUrl = window.location.origin;

  // Setup Meta Tags for the Blog Listing Page
  const latestPost: BlogPost | undefined = posts?.[0];
  const pageTitle =
    "Our Blog - Latest House Plans & Design Insights | HousePlanFiles";
  const pageDescription =
    "Explore our latest articles, house plan tips, and architectural insights. Stay informed with expert advice from HousePlanFiles.";

  // Calculate Image URL for the listing page (use latest post image or a default)
  let ogImage = `${siteUrl}/default-blog-image.jpg`; // Fallback
  if (latestPost && latestPost.mainImage) {
    ogImage = latestPost.mainImage.startsWith("http")
      ? latestPost.mainImage
      : `${backendApiUrl}${latestPost.mainImage}`;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}${location.pathname}`} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteUrl}${location.pathname}`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 md:mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                Our Latest Insights & Blog Posts
              </h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Stay updated with the newest trends, design tips, and expert
                advice.
              </p>
              <div className="mt-6 h-1 w-32 bg-primary mx-auto rounded-full"></div>
            </motion.div>

            {status === "loading" && (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {status === "failed" && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-4 text-xl font-semibold text-destructive">
                  Failed to Load Posts
                </h3>
                <p className="mt-2 text-muted-foreground">{String(error)}</p>
              </div>
            )}

            {status === "succeeded" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {posts.map((post, index) => {
                  // Logic for Image URL in the grid
                  const gridImageUrl = post.mainImage?.startsWith("http")
                    ? post.mainImage
                    : `${backendApiUrl}${post.mainImage}`;

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                          <div className="overflow-hidden">
                            <img
                              src={gridImageUrl}
                              alt={post.imageAltText || post.title}
                              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-200">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm flex-grow mb-4 line-clamp-3">
                              {post.description}
                            </p>
                            <div className="flex items-center text-muted-foreground text-xs mt-auto">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="mr-4">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              <User className="w-4 h-4 mr-2" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogsPage;
