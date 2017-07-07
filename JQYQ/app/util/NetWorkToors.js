/**
 * Created by jiahailiang on 2017/7/7.
 */
/** * Created by eleven on 16/6/3. */
import React,{ NetInfo } from 'react-native';
const NOT_NETWORK = "网络不可用，请稍后再试";
const TAG_NETWORK_CHANGE = "NetworkChange";
/*** * 检查网络链接状态 * @param callback */
const checkNetworkState = (callback) =>{
    NetInfo.isConnected.fetch().done(
        (isConnected) => { callback(isConnected); }
    );
};
const J_connectionInfo = (callBack) => {
    NetInfo.fetch().done(
        (connectionInfo) => {
        callBack(connectionInfo)

    });
};

/*** * 移除网络状态变化监听 * @param tag * @param handler */
const removeEventListener = (tag,handler) => {
    NetInfo.isConnected.removeEventListener(tag, handler);
} ;
/*** * 添加网络状态变化监听 * @param tag * @param handler */
const addEventListener = (tag,handler)=>{
    NetInfo.isConnected.addEventListener(tag, handler);
} ;
export default{ J_connectionInfo,checkNetworkState, addEventListener, removeEventListener, NOT_NETWORK, TAG_NETWORK_CHANGE }

