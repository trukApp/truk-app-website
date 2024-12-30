import React from 'react'
import styles from './Settings.module.css';
import Image from 'next/image';

const SettingsComponent = () => {
    return (
        <div className={styles.settingsBgContainer}>
            <h2 className={styles.sectionMainHeading}>Settings</h2>
            <div className={styles.cardsMainContainer}>
                <div className={styles.cardContainer}>
                    <Image src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" width={100} height={100} alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>User settings</h3>
                </div>

                <div className={styles.cardContainer}>
                    <Image src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" width={100} height={100}  alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Config settings</h3>
                </div>

                <div className={styles.cardContainer}>
                    <Image src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" width={100} height={100}  alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Notification settings</h3>
                </div>

                <div className={styles.cardContainer}>
                    <Image src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" width={100} height={100} alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>System connections</h3>
                </div>
            </div>

        </div>
    )
}

export default SettingsComponent