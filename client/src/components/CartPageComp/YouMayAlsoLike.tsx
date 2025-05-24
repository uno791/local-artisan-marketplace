import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";
import SectionHeading from "./SectionHeading";
import RecommendationScroller from "./RecommendationScroller";
import { Product } from "../SearchPageComp1/ProductCard";
import styles from "./YouMayAlsoLike.module.css";

function YouMayAlsoLike() {
  const { user } = useUser();
  const [recommended, setRecommended] = useState<Product[]>([]);

  // fetch recommendations based on tags and category of items in user's cart
  useEffect(() => {
    if (!user?.username) return;

    const fetchRecommendations = async () => {
      try {
        const cartRes = await axios.get(`${baseURL}/cart/${user.username}`);
        const cartItems = cartRes.data;
        const cartIds = cartItems.map((item: any) => item.product_id);

        if (cartIds.length === 0) {
          setRecommended([]);
          return;
        }

        // build tag list and priority order from cart items
        const tagSet = new Set<string>();
        const tagPriority: string[] = [];

        for (const id of cartIds) {
          const prodRes = await axios.get(`${baseURL}/product/${id}`);
          const prod = prodRes.data;

          // collect tags from product
          prod.tags?.forEach((tag: string) => {
            if (!tagSet.has(tag)) {
              tagSet.add(tag);
              tagPriority.push(tag);
            }
          });

          // include category if it's not already added
          if (prod.category_name && !tagSet.has(prod.category_name)) {
            tagSet.add(prod.category_name);
            tagPriority.push(prod.category_name);
          }
        }

        // request recommendations from backend using tags
        const recRes = await axios.post(`${baseURL}/recommend-by-tags`, {
          tags: tagPriority,
          excludeProductIds: cartIds,
          limitPerTag: 4,
        });

        setRecommended(recRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch recommendations:", err);
        setRecommended([]);
      }
    };

    fetchRecommendations();
  }, [user?.username]);

  // don't render section if no recommendations
  if (recommended.length === 0) return null;

  return (
    <section className={styles.wrapper}>
      <SectionHeading />
      <RecommendationScroller products={recommended} />
    </section>
  );
}

export default YouMayAlsoLike;
