/**
 * Created by jiahailiang on 2017/2/28.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';

import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
} from 'react-native-swRefresh'
const {width,height}=Dimensions.get('window');
import {NavGoBack} from '../component/NavGoBack';
import NavigationBar from 'react-native-navbar';
import ArticleDetails from './ArticleDetails';
import px2dp from '../util/Px2dp';
import ModalDropdown from 'react-native-modal-dropdown';
import {toastShort} from '../component/Toast';
import Network from '../util/Network';
import '../util/dateFormat';
import Header from '../component/Header'

export default class NewClass extends Component{
    _page=1;
    _dataSource = new ListView.DataSource({rowHasChanged:(row1,row2)=>row1 !== row2});
    _dataArr=[];
    params = new Object();
    constructor(props) {
        super(props);
        this.buttonGoBack = this.buttonGoBack.bind(this);
        this.state = {
            dataSource:this._dataSource.cloneWithRows(this._dataArr),
            message:'',
            title:'',
            id:'2',//图片
            open: false,
            visible: false,
            scale: new Animated.Value(1),
            x: new Animated.Value(0),
            downArr:[],//下拉框数组
            carrie:'',//载体
            dataArr:[],//列表数组
            value:'',
            aspect:'',
            sequence:'',
            articleList:[],
            nextTime:'',
            time:'',
            deepText:'加载中...'
        };
        this.icons = {
            yuqing:require('../image/lable/yuqing@3x.png'),
            zhengmian:require('../image/lable/zhengmian@3x.png'),
            fumian:require('../image/lable/fumian@3x.png'),
            xiangguan:require('../image/lable/xiangguan@3x.png'),
        }
    }

    buttonGoBack(){
        const {navigator} = this.props;
        return NavGoBack(navigator);
    };
    //去除文章的前后空格
    _trimStr(str){
        return str.replace(/(^\s*)|(\s*$)/g,"");
    }
//下拉框点击事件
    _dropdown_6_onSelect(index,value) {
        this.params.carrie=this.state.carrie;//载体
        //this.params.nature=this.state.aspect;//相关
        this.params.sort=this.state.sequence;//热度
        this.params.time=this.state.time;
        Network.post('apppanorama2/getList',this.params,(response)=>{
            let resArr=response.rows;
            if(!response.rows){
                toastShort('没有相关数据');
                return;
            }
            //此处可优化
            for (let i in resArr){
                resArr[i].publishTime = resArr[i].publishTime.replace(".000Z", "").replace("T"," ");
            }
            this._dataArr = resArr;
            this.setState({
                dataArr:resArr,
                dataSource:this._dataSource.cloneWithRows(resArr)
            })
        },(err)=>{err});
    }

    render(){
        const leftButtonConfig = {
            title: '←',
            handler: () => this.buttonGoBack(),
            fontSize:32,
            tintColor: '#FFF'
        };
        const titleConfig = {
            title: this.state.title,
            tintColor: '#FFF'
        };
        const bar = {
            style:'light-content',
        };
        return (
            <View style={{flex:1,flexDirection:'column'}}>
                <View>
                    <Header {...this.props}
                            title={this.state.title}
                        //righticon={require('../image/yuqing@2x.png')}
                        //renderCustomView={this._renderCustomView}
                        //lefticon={require('../image/zuo.png')}
                            headercolor={'#18242e'}
                        //rightAction={() => this.show()}
                        //rightmenu='分享'
                    />
                </View>
                <View style={{width:width,height:40,flexDirection:'row',borderBottomColor:'#ececec',
                    borderBottomWidth:1}}>
                    <View style={styles.dropdown_1}>
                    <ModalDropdown options={['全部','综合','新闻','博客','论坛','微博','微信','QQ群','电子报','视频','手机wap']}
                                   defaultValue='载体'
                                   textStyle={{fontSize:px2dp(15),padding:px2dp(10),textAlign:'center'}}
                                   //style={styles.dropdown_1}
                                   dropdownStyle={styles.dropdown_9}
                                   onSelect={(idx, value) => {

                                       if (idx == 0) {
                                           this.state.carrie='';
                                       }else {
                                           this.state.carrie=value;
                                       }
                                       this._dropdown_6_onSelect(idx, value)
                                   }}
                    />
                    <Image source={require('../image/down.png')} style={{width:10,height:10}} />
                    </View>
                    <View style={styles.dropdown_1}>
                        <ModalDropdown options={['热度降序','时间降序']}
                                       defaultValue='排序'
                                       textStyle={{fontSize:px2dp(15),padding:px2dp(10),textAlign:'center'}}
                                       //style={styles.dropdown_1}
                                       dropdownStyle={styles.dropdown_9}
                                       onSelect={(idx, value) => {
                                           if(idx==0){
                                               this.state.sequence = 'hot';
                                           }else if(idx == 1) {
                                               this.state.sequence = 'publishTime';
                                           }
                                           this._dropdown_6_onSelect(idx, value)
                                       }}
                        />
                        <Image source={require('../image/down.png')} style={{width:10,height:10}} />
                    </View>
                    <View style={styles.dropdown_1}>

                        <ModalDropdown options={['不限','今日','昨日','本周','近30天']}
                                       defaultValue='时间'
                                       textStyle={{fontSize:px2dp(15),padding:px2dp(9),textAlign:'center'}}
                                       dropdownStyle={styles.dropdown_9}
                                       onSelect={(idx, value) => {
                                           if(idx==0){
                                               this.state.time = 'all';
                                           }else if(idx == 1) {
                                               this.state.time = 'today';
                                           }else if(idx == 2) {
                                               this.state.time = 'yesterday';
                                           }else if(idx == 3) {
                                               this.state.time = 'week';
                                           }else if(idx == 4) {
                                               this.state.time = 'month';
                                           }
                                           this._dropdown_6_onSelect(idx, value)
                                       }}
                        />
                        <Image source={require('../image/down.png')} style={{width:10,height:10}} />
                    </View>
                </View>
                <View style={{flex:1}}>{this._renderListView()}</View>
            </View>
        );

    }

    _renderListView(){
        return(
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                renderRow={this._renderRow.bind(this)}
                onRefresh={this._onListRefersh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                enableEmptySections = {true}
                pusuToLoadMoreTitle={this.state.deepText}


            />
        )
    }
    _pressRow(title,id){
        var _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name:'ArticleDetails',
                component:ArticleDetails,
                params:{
                    id:id,
                    title:title,
                }
            })
        }
    }
    //每行 cell 的内容渲染
    _renderRow(rowData) {
        let icon;
        if(rowData.ispositive == 1){
            icon = this.icons['zhengmian'];
        } else if(rowData.isnegative ==1){
            icon = this.icons['fumian'];
        } else {
            if(rowData.isyuqing ==1 ){
                icon = this.icons['yuqing'];
            } else {
                icon = this.icons['xiangguan'];
            }
        }
        return (
            <TouchableOpacity onPress={() => this._pressRow(rowData.title,rowData.id)}>
                <View style={styles.cell}>
                    <View style={{width:width,height:px2dp(70)}}>
                        <Text style={styles.cellTitle} numberOfLines={2}>{ this._trimStr(rowData.title)}</Text>
                    </View>
                    <View style={{flexDirection:'row',width:width,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                            <Image source={icon} style={{marginLeft:px2dp(15),marginBottom:px2dp(15),marginTop:px2dp(5)}} />
                            <Text style={styles.cellText} >{rowData.siteName}</Text>
                            <Text style={styles.cellText}>{rowData.author}</Text>
                        </View>
                        <View style={{marginBottom:px2dp(10)}}>
                            <Text style={{marginBottom:px2dp(10),marginRight:15,fontSize:11, color:'#999999',}}>{rowData.publishTime}</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    /**
     * 刷新
     * @param end
     * @private
     */
    _onListRefersh(end){
        this.timer =  setTimeout(()=>{
            this.params.tagId = this.props.id;
            this.params.pageNo = 1;
            this.params.nextTime = '';
            Network.post('apppanorama2/getList',this.params,(response)=>{
                let resArr = response.rows;
                for (let i in resArr){
                    resArr[i].publishTime = resArr[i].publishTime.replace(".000Z", "").replace("T"," ");
                }
                this._dataArr = resArr;
                this.setState({
                    dataArr:resArr,
                    dataSource:this._dataSource.cloneWithRows(resArr)
                })
            },(err)=>{err});//加载的状态
            end();//刷新成功后需要调用end结束刷新
        },1500)

    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    /**
     * 加载更多
     * @param end
     * @private
     */
    _onLoadMore(end){
        let timer =  setTimeout(()=>{
            clearTimeout(timer);
        },2000);
        this._page++;
        this.params.pageNo = this._page;
        this.params.nextTime = this.state.nextTime;
        //添加的
        this.params.tagId = this.props.id;
        //筛选的
        Network.post('apppanorama2/getList',this.params,(response)=>{
            let resArr= response.rows;
            if (!response.rows) {
                toastShort('没有更多数据了');
                this.setState({
                   deepText:'已经加载到底了(￣︶￣)~ ~'
                });
                return;
            }
            for (let i in resArr){
                resArr[i].publishTime = resArr[i].publishTime.replace(".000Z", "").replace("T"," ");
            }
            this._dataArr = this._dataArr.concat(resArr);
            this.setState({
                dataArr:resArr,
                nextTime:response.nextTime ,
                dataSource:this._dataSource.cloneWithRows(this._dataArr)
            })
        },(err)=>{err});
        end(!this.state.dataArr || this.state.dataArr.length <10);//加载结束条件
    }

    componentDidMount() {
        this.params.nature=this.props.title;
        this.params.tagId = this.props.id;
        this.setState({title:this.props.title});
        Network.post('apppanorama2/getList',this.params,(response)=>{
            if (!response.rows){
                toastShort('暂无数据');
                this.setState({
                    deepText:'已经加载到底了(￣︶￣)~ ~'
                });
                return;
            }
            let resArr= response.rows;
            for (let i in resArr){
                resArr[i].publishTime = resArr[i].publishTime.replace(".000Z", "").replace("T"," ");
            }
            this._dataArr = this._dataArr.concat(resArr);
            this.setState({
                dataArr:resArr,
                nextTime:response.nextTime ,
                dataSource:this._dataSource.cloneWithRows(this._dataArr),
            })
        },(err)=>{err});
    }

}


const styles=StyleSheet.create({
    container:{

    },
    content:{
        width:width,
        height:height,
        backgroundColor:'yellow',
        justifyContent:'center',
        alignItems:'center'
    },
    cell:{
        height:px2dp(100),
        backgroundColor:'#FFF',
        borderBottomColor:'#ececec',
        borderBottomWidth:1
    },
    cellTitle:{
        paddingTop:px2dp(17),
        paddingLeft:px2dp(15),
        paddingRight:px2dp(15),
        paddingBottom:px2dp(15),
        fontSize:15,
        color:'#333333',
    },
    cellText:{
        fontSize:11,
        color:'#999999',
        marginLeft:px2dp(10),
        marginBottom:px2dp(10),
        marginTop:px2dp(5)
    },
    cellImageView:{
        flexDirection:'row',

    },
    cellImage:{

    },
    dropdown_1: {
        top: 0,
        width:width/3,
        height:39,
        backgroundColor:'#FFF',
        //borderColor:'#333333',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    dropdown_9: {
        flex: 1,
        height:160,
        width:px2dp(80),
        backgroundColor:'#FFF'
    },
    dropdown_8: {
        flex: 1,
        height:px2dp(160),
        width:width,
        backgroundColor:'#666666'
    },
    modal: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#00000000',
        flexDirection:'column',

    },

    modal2: {
        top: 110,
        right: 0,
        bottom: 100,
        left: 0,
        backgroundColor: '#FFF',
        flexDirection:'column'

    },
    buttonlayout: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        width:width,
        height:30,
        marginLeft:15,
    },

    buttonlayout1: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        width:width,
        height:30,
        marginLeft:15
    },


    buttonleft: {
        borderRadius: 10,
        borderColor: '#666666',
        borderWidth: 1,
        marginLeft:10,
        width:55,
        padding:3
    },
    buttonright: {
        borderRadius: 10,
        borderColor: '#666666',
        borderWidth: 1,
        marginLeft:10,
        width:69,
        padding:3
    },
    button: {
        textAlign: 'center',
        fontSize:12,
        color:'#666666'


    },
    buttondivideline: {
        // width: 1,
        // height: 30,
        // backgroundColor: '#f4f4f4',
        // flexDirection: 'column',
        // marginLeft:5,
        // marginRight:5,
        // borderRadius: 8,
    },


});
