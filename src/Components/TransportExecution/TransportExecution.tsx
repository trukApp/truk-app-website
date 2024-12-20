import React from 'react'
import styles from './TransportExecution.module.css'

const TransportExecution = () => {
    return (
        <div className={styles.settingsBgContainer}>
            <h2 className={styles.sectionMainHeading}>Transport execution</h2>
            <div className={styles.cardsMainContainer}>
                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Transport order overview</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Dock management</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Operations</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Tracking</h3>
                </div>
            </div>

        </div>
    )
}

export default TransportExecution