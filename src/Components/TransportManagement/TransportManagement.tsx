'use client';
import React from 'react'
import styles from './TransportManagement.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

const TransportManagement = () => {
    const router = useRouter();

    const navigateToCreatePackagePage = () => {
        console.log('Navigating to Create Package Page');
        router.push('/createpackage');
    }

    return (
        <div className={styles.settingsBgContainer}>
            <h2 className={styles.sectionMainHeading}>Transport Management</h2>
            <div className={styles.cardsMainContainer}>
                <div className={styles.cardContainer} onClick={navigateToCreatePackagePage}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Transport unit creation</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Product master</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Business partners</h3>
                </div>

                <div className={styles.cardContainer}>
                    <img src="https://jai-mp.s3.eu-north-1.amazonaws.com/settings-3110.png" alt="Icon" className={styles.settingImage} />
                    <h3 className={styles.cardheading}>Master data</h3>
                </div>
            </div>

        </div>
    )
}

export default TransportManagement