import React from 'react';
import styles from './index.less';
import BackgroundImage from '@/assets/images/background.jpg'

const Home = () => {
  return <div className={styles.home}>
    <img src={BackgroundImage} className={styles.image} />
  </div>
}

export default React.memo(Home)
