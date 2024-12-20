'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import styles from './TransportPlanning.module.css'

const TransportPlanning = () => {
    const router = useRouter();

    const navigateToCreateOrderPage = () => {
        console.log('Navigating to Create Package Page');
        router.push('/createorder');
    }
    return (
        <div className={styles.settingsBgContainer}>
            <h2 className={styles.sectionMainHeading}>Transport Planning </h2>
            <div className={styles.cardsMainContainer}>
                <div className={styles.cardContainer} onClick={navigateToCreateOrderPage}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Transport order planning</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Spot auction</h3>
                </div>
            </div>

        </div>
    )
}

export default TransportPlanning