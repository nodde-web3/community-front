import styles from "@/styles/Home.module.css";
import React from "react";

export default function Footer() {
  return (
    <div className={styles.description}>
      <div className={styles.footer_content}>
        <div>NODDE</div>
        <div>
          NODDE is a Web3 native social platform
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <a href="https://discord.gg/bnbchain" target="_blank">
          <div
            className={`${styles.footer_images} ${styles.discord_footer_image}`}
          ></div>
        </a>
        <a href="https://twitter.com/BNBChain" target="_blank">
          <div
            className={`${styles.footer_images} ${styles.twitter_footer_image}`}
          ></div>
        </a>
      </div>
    </div>
  );
}
