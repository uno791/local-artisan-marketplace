import styles from "./YouMayAlsoLike.module.css";
import SectionHeading from "./SectionHeading";
import RecommendationScroller from "./RecommendationScroller";

function YouMayAlsoLike() {
  return (
    <section className={styles.wrapper}>
      <SectionHeading />
      <RecommendationScroller />
    </section>
  );
}

export default YouMayAlsoLike;
