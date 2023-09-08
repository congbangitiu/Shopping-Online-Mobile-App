import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { UserType } from '../UserContext';

const AddressScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [street, setStreet] = useState('');
    const [landmark, setLandmark] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const { userId, setUserId } = useContext(UserType);
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        };

        fetchUser();
    }, []);
    console.log(userId);
    const handleAddAddress = () => {
        const address = {
            name,
            mobileNo,
            houseNo,
            street,
            landmark,
            postalCode,
        };

        axios
            .post('http://192.168.1.8:3000/addresses', { userId, address }, { timeout: 15000 })
            .then((response) => {
                Alert.alert('Success', 'Addresses added successfully');
                setName('');
                setMobileNo('');
                setHouseNo('');
                setStreet('');
                setLandmark('');
                setPostalCode('');

                setTimeout(() => {
                    navigation.goBack();
                }, 500);
            })
            .catch((error) => {
                if (error.response) {
                    // Có phản hồi từ máy chủ, nhưng nó có mã trạng thái lỗi (không phải lỗi mạng)
                    console.error('Server error:', error.response.data);
                    Alert.alert('Server error', 'Failed to add address.');
                } else if (error.request) {
                    // Không có phản hồi từ máy chủ, có thể là lỗi mạng
                    console.error('Network error:', error.request);
                    Alert.alert('Network error', 'Please check your internet connection.');
                } else {
                    // Lỗi khác
                    console.error('An error occurred:', error.message);
                    Alert.alert('Error', 'An error occurred. Please try again later.');
                }
            });
    };

    return (
        <ScrollView style={{ marginTop: 50 }}>
            <View style={{ height: 50, backgroundColor: '#00CED1', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Add a new address</Text>
            </View>
            <View style={{ padding: 10 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Country</Text>
                    <TextInput
                        placeholderTextColor={'black'}
                        placeholder="India"
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Full name (First and last name)</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Enter your name"
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Mobile number</Text>
                    <TextInput
                        value={mobileNo}
                        onChangeText={(text) => setMobileNo(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="(+91) xxxxxxxxx"
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Flat, House No, Building, Company</Text>
                    <TextInput
                        value={houseNo}
                        onChangeText={(text) => setHouseNo(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder=""
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Area, Street, Sector, Village</Text>
                    <TextInput
                        value={street}
                        onChangeText={(text) => setStreet(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder=""
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Landmark</Text>
                    <TextInput
                        value={landmark}
                        onChangeText={(text) => setLandmark(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Eg: Near Appollo hospital"
                    />
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Pincode</Text>

                    <TextInput
                        value={postalCode}
                        onChangeText={(text) => setPostalCode(text)}
                        placeholderTextColor={'black'}
                        style={{
                            padding: 10,
                            borderColor: '#D0D0D0',
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5,
                        }}
                        placeholder="Enter pincode"
                    />
                </View>

                <Pressable
                    onPress={handleAddAddress}
                    style={{
                        backgroundColor: '#FFC72C',
                        padding: 19,
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({});
