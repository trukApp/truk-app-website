import React from 'react'
import styles from './RatingsAndReview.module.css'

export const RatingsAndReviews = () => {
    return (
        <div className={styles.settingsBgContainer}>
            <h2 className={styles.sectionMainHeading}>Reviews & Ratings</h2>
            <div className={styles.cardsMainContainer}>
                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Transport order analytics</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Carrier perfomance</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Cost analysis</h3>
                </div>
            </div>

        </div>
    )
}
