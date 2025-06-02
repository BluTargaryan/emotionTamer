import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import HistoryListItem from './HistoryListItem'
const HomeHistory = () => {
  return (
    
        <View className='flex flex-col gap-4'>
            <Text className='text-primary text-2xl font-bold'>History</Text>
                <ScrollView  
                    className='h-96'
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                        gap: 10,
                        paddingBottom: 20,
                        paddingRight: 8
                    }}
                >
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                    <HistoryListItem />
                </ScrollView>
        </View>


  )
}

export default HomeHistory