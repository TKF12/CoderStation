import {useState, useEffect} from 'react';

// api
import { getPointsListApi } from '../api/userApi';

// jsx
import PointsRankingItem from './PointsRankingItem';

// antd
import { Card } from 'antd';


function PointsRanking(props) {

    // 前十名用户列表
    const [pointsUserList, setPointsUserList] = useState([]);

    // 获取前十名用户
    useEffect(() => {
        async function fetchPoints() {
            const { data } = await getPointsListApi();
            setPointsUserList(data);
        }
        fetchPoints();
    },[])


    const pointsList = pointsUserList.map((item, i) => {
        return (<PointsRankingItem
                    key={i}
                    itemInfo={item}
                    rNum={i + 1}
                />);
    })

    return (
        <Card title="积分排行" style={{marginTop: '30px'}}>
            {pointsList}
        </Card>
    );
}

export default PointsRanking;