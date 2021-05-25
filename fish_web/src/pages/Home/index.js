import React, { useContext } from 'react'
import styles from './styles.module.scss'
import { Link } from 'react-router-dom'
import { Store as GlobalStore } from '../../hook.redux/global'


const Home = (props) => {
    const { dispath: globalDispath, state: globalState } = useContext(GlobalStore)
    const { userInfo } = globalState

    console.log('store', GlobalStore)
    return (
        <div className={styles.home}>
            <div>这是一个首页</div>
            <div>
                <span>当前你还没有登录，请<Link to="/login">登录</Link></span>
            </div>
            <div>
                登录后会根据用户身份跳转到相应的页面：
                <Link to="/admin">管理员等页面-电脑端</Link>
                {/* <span>        </span> */}
                <Link to="/productionStaff">生产员页面-手机端</Link>
            </div>
        </div>
    )
}

export default Home
