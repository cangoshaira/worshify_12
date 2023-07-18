import { StyleSheet, Text, View, Dimensions, TextInput, ScrollView, ImageBackground, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { ref as ref_db, set, push, child, onValue, DataSnapshot } from 'firebase/database';
import { db } from '../../firebase';
import DateTimePicker from '@react-native-community/datetimepicker'

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

const GigOverview = ({ InstrumentsNeeded, GenreNeeded, uid, gigName, gigAddress, gigDate, StartTime, EndTime, eventType, img }) => {


    const [items, setItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Anyone', value: 'Anyone' },

    ]);
    const [showPicker, setShowPicker] = useState(false);
    const [startVisible, setStartVisible] = useState(false);
    const [endVisible, setEndVisible] = useState(false);

    const [quantityZero, setQuantityZero] = useState(0);
    const [quantityOne, setQuantityOne] = useState(0);
    const [quantityTwo, setQuantityTwo] = useState(0);
    const [gender, setGender] = useState(null);
    const [open, setOpen] = useState(false);
    const [about, setAbout] = useState('');
    const [instrumentsNeeded, setInstrumentsNeeded] = useState([
        { name: InstrumentsNeeded[0], quantity: quantityZero },
        { name: InstrumentsNeeded[1], quantity: quantityOne },
        { name: InstrumentsNeeded[2], quantity: quantityTwo },
    ])
    const [gigCreated, setGigCreated] = useState(false);
    const [date, setDate] = useState(gigDate || new Date());
    const [startTime, setStartTime] = useState(StartTime || new Date());
    const [endTime, setEndTime] = useState(EndTime || new Date());



    //handles gig creation
    //add gig details at the same time in PostGigs and UserGigs
    const handleCreateGig = () => {

        //Generates GigPost Key
        const newGigsRefKey = push(child(ref_db(db), 'gigs')).key;
        const UserGigsRef = ref_db(db, 'users/' + '/client/' + uid + '/gigs/' + newGigsRefKey);
        const GigPostsRef = ref_db(db, 'gigPosts/' + '/' + newGigsRefKey);

        const instruments = instrumentsNeeded.map(instrument => ({
            name: instrument.name,
            quantity: instrument.name === InstrumentsNeeded[0]
                ? quantityZero
                : instrument.name === InstrumentsNeeded[1]
                    ? quantityOne
                    : quantityTwo,
        }));

        set(UserGigsRef, {
            uid: uid,
            Gig_Name: gigName,
            Gig_Address: gigAddress,
            Gig_Date: gigDate.toDateString(),
            Gig_Start: formatTime(StartTime),
            Gig_End: formatTime(EndTime),
            Event_Type: eventType,
            Instruments_Needed: instruments,
            Genre_Needed: GenreNeeded,
            postID: newGigsRefKey,
            Gig_Image: img,
            about: about,
            gender: gender,
            gigStatus: 'Available'
        });


        set(GigPostsRef, {
            uid: uid,
            Gig_Name: gigName,
            Gig_Address: gigAddress,
            Gig_Date: gigDate.toDateString(),
            Gig_Start: formatTime(StartTime),
            Gig_End: formatTime(EndTime),
            Event_Type: eventType,
            Instruments_Needed: instruments,
            Genre_Needed: GenreNeeded,
            postID: newGigsRefKey,
            Gig_Image: img,
            about: about,
            gender: gender,
            gigStatus: 'Available'
        });

        setGigCreated(true);

    }

    useEffect(() => {
        console.log(gigDate.toDateString())
        console.log(formatTime(StartTime))
    }, [])

    const QuantityZeroBtn = () => {
        return (
            <View style={styles.btnQuantity}>
                <TouchableOpacity onPress={() => setQuantityZero(quantityZero - 1)} style={styles.btnSprt}>
                    <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.btnSprt}>{quantityZero}</Text>

                <TouchableOpacity onPress={() => setQuantityZero(quantityZero + 1)} style={styles.btnSprt}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const QuantityOneBtn = () => {
        return (
            <View style={styles.btnQuantity}>
                <TouchableOpacity onPress={() => setQuantityOne(quantityOne - 1)} style={styles.btnSprt}>
                    <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.btnSprt}>{quantityOne}</Text>

                <TouchableOpacity onPress={() => setQuantityOne(quantityOne + 1)} style={styles.btnSprt}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const QuantityTwoBtn = () => {
        return (
            <View style={styles.btnQuantity}>
                <TouchableOpacity onPress={() => setQuantityTwo(quantityTwo - 1)} style={styles.btnSprt}>
                    <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.btnSprt}>{quantityTwo}</Text>

                <TouchableOpacity onPress={() => setQuantityTwo(quantityTwo + 1)} style={styles.btnSprt}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const toggleDatepicker = () => {
        setShowPicker(!showPicker)
    };

    const onChange = ({ type }, selectedDate) => {
        if (type == 'set') {
            const currentDate = selectedDate;
            setDate(new Date(currentDate));

            if (Platform.OS === 'android') {
                toggleDatepicker()
                // setDate(currentDate.toDateString());
                setDate(new Date(currentDate))
            } else if (Platform.OS === 'ios') {
                toggleDatepicker()
                // setDate(currentDate.toDateString());
                setDate(new Date(currentDate))
            }

        } else {
            toggleDatepicker();
        }
    };


    const toggleTimepickerStart = () => {
        setStartVisible(!startVisible)
    };

    const onChangeStartTime = ({ type }, selectedTime) => {
        if (type == 'set') {
            const currentTime = new Date(selectedTime);
            setStartTime(currentTime);

            if (Platform.OS === 'android') {
                toggleTimepickerStart()
                // setStartTime(formatTime(currentTime));
                setStartTime(new Date(currentTime));
            } else if (Platform.OS === 'ios') {
                toggleTimepickerStart()
                // setStartTime(formatTime(currentTime));
                setStartTime(new Date(currentTime));
            }

        } else {
            toggleTimepickerStart();
        }
    };

    const toggleTimepickerEnd = () => {
        setEndVisible(!endVisible)
    };

    const onChangeEndTime = ({ type }, selectedTime) => {
        if (type == 'set') {
            const currentTime = new Date(selectedTime);
            setEndTime(currentTime);

            if (Platform.OS === 'android') {
                toggleTimepickerEnd()
                setEndTime(new Date(currentTime));
            } else if (Platform.OS === 'ios') {
                toggleTimepickerStart()
                // setStartTime(formatTime(currentTime));
                setStartTime(new Date(currentTime));
            }

        } else {
            toggleTimepickerEnd();
        }
    };

    const formatTime = (rawTime) => {
        let time = new Date(rawTime);
        let hours = time.getHours();
        let minutes = time.getMinutes();

        return `${hours}:${minutes}`;
    }


    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleTxt}>Review and Create Gig</Text>

                        <Text style={{ fontSize: 12 }}>Double check the information below before proceeding</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.inputContainer}>
                            <Text>Gig Title:</Text>
                            <TextInput
                                value={gigName}
                                placeholder={gigName}
                                style={styles.inputStyle}
                                editable={false} />
                        </View>

                        <View style={styles.timeContainer}>

                            {!showPicker && (
                                <Pressable
                                    onPress={toggleDatepicker}>
                                    <TextInput
                                        placeholder='Choose Gig Date'
                                        placeholderTextColor='#11182744'
                                        value={date instanceof Date ? date.toDateString() : ''}
                                        onChangeText={setDate}
                                        editable={false}
                                        style={styles.dateStyle}
                                    />
                                </Pressable>

                            )}


                            {showPicker && (
                                <DateTimePicker
                                    mode='date'
                                    display='spinner'
                                    value={date}
                                    onChange={onChange}
                                    is24Hour={false}
                                />
                            )}



                            {!startVisible && (
                                <Pressable
                                    onPress={toggleTimepickerStart}>
                                    <TextInput
                                        placeholder='Choose Start Time'
                                        placeholderTextColor='#11182744'
                                        value={startTime instanceof Date ? formatTime(startTime) : ''}
                                        onChangeText={setStartTime}
                                        editable={false}
                                        style={styles.dateStyle}
                                    />
                                </Pressable>

                            )}


                            {startVisible && (
                                <DateTimePicker
                                    mode='time'
                                    display='spinner'
                                    value={startTime}
                                    onChange={onChangeStartTime}
                                    is24Hour={false}
                                />
                            )}


                            {!endVisible && (
                                <Pressable
                                    onPress={toggleTimepickerEnd}>
                                    <TextInput
                                        placeholder='Choose End Time'
                                        placeholderTextColor='#11182744'
                                        value={endTime instanceof Date ? formatTime(endTime) : ''}
                                        onChangeText={setEndTime}
                                        editable={false}
                                        style={styles.dateStyle}
                                    />
                                </Pressable>

                            )}


                            {endVisible && (
                                <DateTimePicker
                                    mode='time'
                                    display='spinner'
                                    value={endTime}
                                    onChange={onChangeEndTime}
                                />
                            )}


                        </View>


                        <View style={styles.inputContainer}>
                            <Text>Gig Address:</Text>
                            <TextInput
                                value={gigAddress}
                                placeholder={gigAddress}
                                style={styles.inputStyle}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text>Event Type:</Text>
                            <TextInput
                                value={eventType}
                                placeholder={eventType}
                                style={styles.inputStyle}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text>Instruments:</Text>

                            <View>
                                <View style={styles.rootInstrument}>
                                    <Text style={styles.instrumentsContainer}>{InstrumentsNeeded[0]}</Text>
                                    <QuantityZeroBtn />
                                </View>
                                <View style={styles.rootInstrument}>
                                    <Text style={styles.instrumentsContainer}>{InstrumentsNeeded[1]}</Text>
                                    <QuantityOneBtn />
                                </View>
                                <View style={styles.rootInstrument}>
                                    <Text style={styles.instrumentsContainer}>{InstrumentsNeeded[2]}</Text>
                                    <QuantityTwoBtn />
                                </View>
                            </View>

                        </View>

                        <View>
                            <View style={styles.eventContainer}>
                                <Text style={styles.txtStyles}>Sex:</Text>
                                <DropDownPicker
                                    open={open}
                                    value={gender}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setGender}
                                    setItems={setItems}
                                    dropDownDirection='TOP'
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text>About:</Text>
                            <TextInput
                                value={about}
                                placeholder='Set About'
                                onChangeText={text => setAbout(text)}
                                style={styles.aboutStyle}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text>Gig Photo:</Text>
                            <View style={styles.imgContainer}>
                                <ImageBackground source={{ uri: img }} style={styles.imgStyle}>

                                </ImageBackground>
                            </View>

                            <TouchableOpacity style={styles.btnStyle} onPress={handleCreateGig}>
                                <View >
                                    {gigCreated ? (<Text style={{ color: 'white', fontWeight: 'bold' }}>Gig Created!</Text>) : (
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Gig</Text>
                                    )}
                                </View>
                            </TouchableOpacity>

                        </View>



                    </View>

                </View>

            </View>
        </ScrollView>
    )
}

export default GigOverview

const styles = StyleSheet.create({
    dateStyle: {
        borderWidth: 2,
        borderColor: '#0EB080',
        borderRadius: 10,
        height: '100%',
        width: '80%'
    },
    rootInstrument: {
        flexDirection: 'row',
    },
    btnSprt: {
        padding: 5,
        marginHorizontal: 5
    },
    btnQuantity: {
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    btnStyle: {
        backgroundColor: '#0EB080',
        marginTop: 30,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    aboutStyle: {
        borderWidth: 2,
        borderColor: '#0EB080',
        borderRadius: 10,
        padding: 5,
        paddingVertical: 20

    },
    imgContainer: {
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#0EB080',
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    imgStyle: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 450,
    },
    instrumentsContainer: {
        borderWidth: 2,
        borderColor: '#0EB080',
        borderRadius: 12,
        padding: 10,
        marginTop: 10,
        width: '75%'
    },
    inputTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputStyle: {
        borderWidth: 2,
        borderColor: '#0EB080',
        borderRadius: 10,
        padding: 5

    },
    inputContainer: {
        marginBottom: 10
    },
    detailsContainer: {
        marginTop: 20
    },
    titleTxt: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20,

    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        padding: 20

    },
    root: {
        height: screenHeight,
        width: screenWidth
    }
})