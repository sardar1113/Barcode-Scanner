import React, { useState, useEffect,useRef } from "react";

import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, Image, Modal, TouchableOpacity,
    Animated, } from "react-native";
import { ScrollView } from "react-native";
import axios from "axios";

const ModalPoup = ({visible, children}) => {
    const [showModal, setShowModal] = useState(visible);
    const scaleValue = useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      toggleModal();
    }, [visible]);
    const toggleModal = () => {
      if (visible) {
        setShowModal(true);
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(() => setShowModal(false), 200);
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    };
    return (
      <Modal visible={showModal}>
        <View style={styles.modalBackGround}>
          <Animated.View
            style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  };
const Separator = () => <View style={styles.separator} />;

const NewApp = ({ Code }) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const apiCall = async (e, url) => {
      axios.get(url).then(function (response) {
          
  
              if (JSON.stringify(response.data.success) === "true") {
                  setVisible(true)
                  setImage(require('./assets/success.png'))
                  setMessage('Status Updated Successfully')
                } else {
                  setVisible(true)
                  setImage(require('./assets/failed.png'))
                  setMessage('Record Not Found in AirTable')
              }
    
          }).catch(function (error) {
              alert(error.message);
          });
  };


return(
    <>

     <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('./assets/x.png')}
                style={{height: 30, width: 30 ,marginBottom: 50 , marginRight : -15}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={image}
            style={{height: 100, width: 100, marginVertical: 10}}
          />
        </View>

        <Text style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}}>
           {message}
        </Text>
      </ModalPoup>
        <View>
            <Button title="Cutting dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/todo/" + Code)} />
        </View>
        <Separator />
        <View>
            <Button title="Crafting dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/inProgress/"+ Code  )} />
        </View>
        <Separator />
        <View>
            <Button title="Cleaning dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/Done/" + Code)} />
        </View>

        <Separator />
        <View>
            <Button title="Quality dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/QA/" + Code )} />
        </View>
        <Separator />
        <View>
            <Button title="Packaging dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/Packed/" + Code)} />
        </View>
        <Separator />
        <View>
            <Button title="Shipping dpt." onPress={(e) => apiCall(e, "https://trackingapi.neon-crafts.com/Shipped/" + Code)} />
        </View>
        <Separator />
    </>
);

}

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState("Not yet scanned");

    const btnBack = () => {
      setScanned(false);
    };

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    };

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data);
        console.log("Type: " + type + "\nData: " + data);
    };
 
    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={"Allow Camera"} onPress={() => askForCameraPermission()} />
            </View>
        );
    }

 // /return the View
    return (
        <>
            {
            !scanned ? 
            (
                <SafeAreaView>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.container}>
                            <View style={styles.barcodebox}>
                                <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ height: 400, width: 400 }} />
                            </View>
                            <Text style={styles.maintext}>{text}</Text>

                            {scanned && <Button title={"Scan again?"} onPress={() => setScanned(false)} color="tomato" />}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            ) 
            : 
            (
                <>
                    <SafeAreaView>
                        <ScrollView style={{ marginTop: 130 , width : 200 , marginLeft : 80}}>
                            <View style={{ marginBottom: 50 }}>
                                <Button title={"< Back"} onPress={btnBack} color="tomato" />
                            </View>
                            <NewApp Code={text} />
                        </ScrollView>
                    </SafeAreaView>
                </>
            )
            }
        </>
    );

    //   if (hasPermission === true) {
    //   return (
    //     <NewApp/>
    //     );
    // }
}

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '70%',
  
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        marginTop: 100,
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    title: {
        marginBottom: 50,
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 200,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    separator: {
        marginVertical: 10,
        borderBottomColor: "#737373",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    barcodebox: {
        alignItems: "center",
        justifyContent: "center",
        height: 300,
        width: 300,
        overflow: "hidden",

        backgroundColor: "tomato",
        marginTop: 50,
    },

    backBtn: {
        marginTop: 50,
    },
});
