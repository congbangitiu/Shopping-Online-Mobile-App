import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import ProductItem from '../components/ProductItem';
import { useNavigation } from '@react-navigation/native';
import { list, images, deals, offers } from '../data';
import { useSelector } from 'react-redux';
import { BottomModal, SlideAnimation, ModalContent } from 'react-native-modals';

const windowWidth = Dimensions.get('window').width;
import { UserType } from '../UserContext';

const HomeScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const renderImageItem = ({ item }) => <Image source={{ uri: item }} style={{ width: '100%', height: 200 }} />;

    const [products, setProducts] = useState([]);
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [category, setCategory] = useState('jewelery');
    const { userId, setUserId } = useContext(UserType);
    const [selectedAddress, setSelectedAdress] = useState('');
    const [items, setItems] = useState([
        { label: "Men's clothing", value: "men's clothing" },
        { label: 'Jewelery', value: 'jewelery' },
        { label: 'Electronics', value: 'electronics' },
        { label: "Women's clothing", value: "women's clothing" },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                setProducts(response.data);
            } catch (error) {
                console.log('error message', error);
            }
        };

        fetchData();
    }, []);

    const onGenderOpen = useCallback(() => {
        setCompanyOpen(false);
    }, []);

    const cart = useSelector((state) => state.cart.cart);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId, modalVisible]);
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://192.168.1.8:3000/addresses/${userId}`);
            const { addresses } = response.data;

            setAddresses(addresses);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        };

        fetchUser();
    }, []);

    return (
        <>
            <SafeAreaView
                style={{
                    paddinTop: Platform.OS === 'android' ? 40 : 0,
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >
                <ScrollView>
                    <View
                        style={{
                            backgroundColor: '#00CED1',
                            padding: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Pressable
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 7,
                                gap: 10,
                                backgroundColor: 'white',
                                borderRadius: 6,
                                height: 38,
                                flex: 1,
                            }}
                        >
                            <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
                            <TextInput placeholder="Search Amazon.in" />
                        </Pressable>

                        <Feather name="mic" size={24} color="black" />
                    </View>

                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                            padding: 10,
                            backgroundColor: '#AFEEEE',
                        }}
                    >
                        <Ionicons name="location-outline" size={24} color="black" />

                        <Pressable>
                            {selectedAddress ? (
                                <Text style={{ fontSize: 13, fontWeight: '500' }}>
                                    Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                                </Text>
                            ) : (
                                <Text style={{ fontSize: 13, fontWeight: '500' }}>Add your location</Text>
                            )}
                        </Pressable>

                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                    </Pressable>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {list.map((item, index) => (
                            <Pressable
                                key={index}
                                style={{
                                    margin: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                    source={{ uri: item.image }}
                                />

                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: '500',
                                        marginTop: 5,
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Carousel
                        data={images}
                        renderItem={renderImageItem}
                        sliderWidth={windowWidth}
                        itemWidth={windowWidth}
                        loop={true}
                        autoplay={true}
                        autoplayInterval={5000}
                        autoplayDelay={1000}
                        hasParallaxImages={true}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold', marginTop: 5 }}>
                        Trending Deals of the week
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {deals.map((item, index) => (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate('Info', {
                                        id: item.id,
                                        title: item.title,
                                        price: item?.price,
                                        carouselImages: item.carouselImages,
                                        color: item?.color,
                                        size: item?.size,
                                        oldPrice: item?.oldPrice,
                                        item: item,
                                    })
                                }
                                style={{
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    style={{ width: 200, height: 200, resizeMode: 'contain' }}
                                    source={{ uri: item?.image }}
                                />
                            </Pressable>
                        ))}
                    </View>
                    <Text
                        style={{
                            height: 1,
                            borderColor: '#D0D0D0',
                            borderWidth: 2,
                            marginTop: 15,
                        }}
                    />

                    <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>Today's Deals</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {offers.map((item, index) => (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate('Info', {
                                        id: item.id,
                                        title: item.title,
                                        price: item?.price,
                                        carouselImages: item.carouselImages,
                                        color: item?.color,
                                        size: item?.size,
                                        oldPrice: item?.oldPrice,
                                        item: item,
                                    })
                                }
                                style={{
                                    marginVertical: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 5,
                                    marginHorizontal: 10,
                                }}
                            >
                                <Image
                                    style={{ width: 150, height: 150, resizeMode: 'contain' }}
                                    source={{ uri: item?.image }}
                                />

                                <View
                                    style={{
                                        backgroundColor: '#E31837',
                                        paddingVertical: 5,
                                        width: 130,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 10,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 13,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Upto {item?.offer}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Text
                        style={{
                            height: 1,
                            borderColor: '#D0D0D0',
                            borderWidth: 2,
                            marginTop: 15,
                        }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '15%' }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginTop: 5,
                            }}
                        >
                            Choose categories:
                        </Text>

                        <View
                            style={{
                                marginHorizontal: 10,
                                marginTop: 20,
                                width: '50%',
                                marginBottom: open ? 50 : 15,
                            }}
                        >
                            <DropDownPicker
                                style={{
                                    borderColor: '#B7B7B7',
                                    height: 30,
                                    marginBottom: open ? 120 : 15,
                                    // width: '60%'
                                }}
                                open={open}
                                value={category} //genderValue
                                items={items}
                                setOpen={setOpen}
                                setValue={setCategory}
                                setItems={setItems}
                                placeholder="Choose category"
                                placeholderStyle={styles.placeholderStyles}
                                onOpen={onGenderOpen}
                                // onChangeValue={onChange}
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {products
                            ?.filter((item) => item.category === category)
                            .map((item, index) => (
                                <ProductItem item={item} key={index} />
                            ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: 'bottom',
                    })
                }
                onHardwareBackPress={() => setModalVisible(!modalVisible)}
                visible={modalVisible}
                onTouchOutside={() => setModalVisible(!modalVisible)}
            >
                <ModalContent style={{ width: '100%', height: 400 }}>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Choose your location</Text>

                        <Text style={{ marginTop: 5, fontSize: 16, color: 'gray' }}>
                            Select a delivery location to see product availabilty and delivery options
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {addresses?.map((item, index) => (
                            <Pressable
                                onPress={() => setSelectedAdress(item)}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderColor: '#D0D0D0',
                                    borderWidth: 1,
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 3,
                                    marginRight: 15,
                                    marginTop: 10,
                                    borderRadius: 10,
                                    backgroundColor: selectedAddress === item ? '#FBCEB1' : 'white',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item?.name}</Text>
                                    <Entypo name="location-pin" size={24} color="red" />
                                </View>

                                <Text numberOfLines={1} style={{ width: 130, fontSize: 13, textAlign: 'center' }}>
                                    {item?.houseNo},{item?.landmark}
                                </Text>

                                <Text numberOfLines={1} style={{ width: 130, fontSize: 13, textAlign: 'center' }}>
                                    {item?.street}
                                </Text>
                                <Text numberOfLines={1} style={{ width: 130, fontSize: 13, textAlign: 'center' }}>
                                    India, Bangalore
                                </Text>
                            </Pressable>
                        ))}

                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Address');
                            }}
                            style={{
                                width: 140,
                                height: 140,
                                borderColor: '#D0D0D0',
                                borderWidth: 1,
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 3,
                                marginRight: 15,
                                marginTop: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: '#0066b2',
                                    fontWeight: '500',
                                }}
                            >
                                Add an address or pick-up point
                            </Text>
                        </Pressable>
                    </ScrollView>

                    <View style={{ flexDirection: 'column', gap: 7, marginBottom: 30 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Entypo name="location-pin" size={22} color="#0066b2" />
                            <Text style={{ color: '#0066b2', fontWeight: '400' }}>Enter an Indian pincode</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                            <Ionicons name="locate-sharp" size={22} color="#0066b2" />
                            <Text style={{ color: '#0066b2', fontWeight: '400' }}>Use my currect location</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                            <AntDesign name="earth" size={22} color="#0066b2" />

                            <Text style={{ color: '#0066b2', fontWeight: '400' }}>Deliver outside India</Text>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({});
