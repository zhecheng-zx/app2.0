/**
 * Created by jiahailiang on 2017/1/30.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Network from '../util/Network';
import '../util/dateFormat';
import {NavGoBack} from '../component/NavGoBack';
import NavigationBar from 'react-native-navbar';
import px2dp from '../util/Px2dp';
//import {toastShort} from '../component/Toast';
import Header from '../component/Header'

import '../util/dateFormat';
var {width,height} = Dimensions.get('window');



export default class SelfInfo extends Component{
    constructor(props){
        super(props);
        this.buttonGoBack = this.buttonGoBack.bind(this);

        this.state = {
            userArr:[],
            isDomestic:false,
            isForeign:false,
            isAllSource:true,
            name:'',
            email:'',
            city:'',
            company:'',
            registerTime:'',
            industry:'',
            userName:'',
        }
    }

    buttonGoBack(){
        const {navigator} = this.props;
        return NavGoBack(navigator);
    };


    componentDidMount() {
        Network.post('app2/profile',{},(response)=>{
            let data = new Date(response.data.user.createdAt.time).Format("yyyy/MM/dd hh:mm");
            this.setState({
                name:response.data.user.name,
                email:response.data.user.email,
                city:response.data.user.city,
                company:response.data.user.company,
                registerTime:data,
                industry:response.data.industry,
                userName:response.data.user.phone,
            })


        },(err)=>{err})

    }


    render(){

        return(
            <View style={{ flex:1 ,flexDirection:'column' , backgroundColor:'#F2F2F2'}}>
                <View>
                    <Header {...this.props}
                            title='个人信息'
                        //righticon={require('../image/yuqing@2x.png')}
                        //renderCustomView={this._renderCustomView}
                        //lefticon={require('../image/zuo.png')}
                            headercolor={'#18242e'}
                    />
                </View>
                <View style={styles.TabViewStyle}>
                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>账号</Text>
                            <Text style={styles.textViiewSmall}>{this.state.userName}</Text>
                        </View>

                    {/*<TouchableOpacity onPress={this.ChangePassword.bind(this)}>*/}
                        {/*<View style={styles.smallViewStyle}>*/}
                            {/*<Text style={styles.textViewStyles}>修改密码</Text>*/}
                            {/*<Text style={styles.textViiewSmall}></Text>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>注册时间</Text>
                            <Text style={styles.textViiewSmall}>{this.state.registerTime}</Text>
                        </View>

                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>姓名</Text>
                            <Text style={styles.textViiewSmall}>{this.state.name}</Text>
                        </View>
                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>邮箱</Text>
                            <Text style={styles.textViiewSmall}>{this.state.email}</Text>
                        </View>
                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>行业</Text>
                            <Text style={styles.textViiewSmall}>{this.state.industry}</Text>
                        </View>
                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>单位</Text>
                            <Text style={styles.textViiewSmall}>{this.state.company}</Text>
                        </View>

                        <View style={styles.smallViewStyle}>
                            <Text style={styles.textViewStyles}>省份</Text>
                            <Text style={styles.textViiewSmall}>{this.state.city}</Text>
                        </View>
                </View>
            </View>
        )


    }

}

const styles = StyleSheet.create({

    TabViewStyle:{
        flexDirection:'column',
        flex:1,
        alignItems:'flex-start'
    },
    smallViewStyle:{
        flexDirection:'row',
        backgroundColor:'#FFF',
        borderBottomWidth:1,
        borderBottomColor:'#F2F2F2',
        width:width,
        justifyContent:'space-between'
    },
    textViewStyles:{
        fontSize:14,
        margin:px2dp(20),
        alignSelf:'center',
    },
    textViiewSmall:{
        fontSize:12,
        alignSelf:'center',
        margin:px2dp(20),
        color:'#666666',
    },
});



