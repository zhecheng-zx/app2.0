/**
 * Created by jiahailiang on 2016/12/8.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,

} from 'react-native';
import Echarts from 'native-echarts';
import Network from '../util/Network'
import BGGlobal from '../util/BGGlobal'

//uri：'file：///android_asset/tpl.html'

//import 'file：///android_asset/tpl.html'


const {width,height}=Dimensions.get('window')
export default class ChartOne extends Component {
    constructor(props) {
        super(props);
        var data = [];

        for (var i = 0; i <= 360; i++) {
            var t = i / 180 * Math.PI;
            var r = Math.sin(2 * t) * Math.cos(2 * t);
            data.push([r, i]);
        }
        this.state = {
            option : '',
            text: 'test',
            jo:[],

        };
    }

    componentDidMount() {
        let params = new Object();
        params.id = BGGlobal.propsID;
        Network.post('appevent2/carrieTrend2',params,(res)=>{
            this.setState({
                option:res.data.option,
                jo:res.data.jo

            });
            console.log(params.id,res.data.option,'222222222222222222222222');
        },(err)=>{
            console.log(err,'图表请求报错',params.id)
        })
    }

    render() {

        return (
            <ScrollView style={styles.container}>

                <Echarts option={this.state.option}  height={300} />

                <View style={{width:width,flexDirection:'column'}}>

                    <View style={{flexDirection:'row',top:10,left:20,right:20}}>
                        <View style={styles.tabHeader}>
                            <Text style={{padding:5,color:'#FFF',fontSize:11,textAlign:'center'}}>载体</Text>
                        </View>
                        <View style={[styles.tabHeaderright,]}>
                            <Text style={{padding:5,color:'#FFF',fontSize:11,textAlign:'center'}}>文章数</Text>
                        </View>
                    </View>

                    {
                        this.state.jo.map((item,i)=> {
                            return (
                                <View key={i} style={styles.tabStyle} >
                                    <Text style={styles.tabText}>{item.name}</Text>
                                    <Text style={styles.tabTextRight}>{item.content}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        top:50,
    },
    tabHeader:{
        backgroundColor:'red',
        borderWidth:1,
        borderColor:'#FFF',
        width:(width-40)/3,
    },
    tabHeaderright:{
        backgroundColor:'red',
        borderWidth:1,
        borderColor:'#FFF',
        width:(width-40)/3*2,
    },
    tabStyle:{
        flexDirection:'row',
        top:10,
        left:20,
        right:20
    },
    tabText:{
        backgroundColor:'blue',
        borderWidth:1,
        borderColor:'#FFF',
        width:(width-40)/3,
        //padding:(5.0),
        color:'#FFF',
        fontSize:11,
        textAlign:'center',
    },
    tabTextRight:{
        backgroundColor:'blue',
        borderWidth:1,
        borderColor:'#FFF',
        width:(width-40)/3*2,
        //padding:(5.0),
        color:'#FFF',
        fontSize:11,
        textAlign:'center',
    }

});