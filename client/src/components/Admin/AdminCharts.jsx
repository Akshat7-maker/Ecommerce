import React, { useEffect, useState } from 'react'
import { DoughnutChart } from './AdminDashboardUi.jsx/Charts'
import useLoader from '@/customHooks/loader'
import axios from 'axios'


function AdminCharts() {

    const [pieChart, setPieChart] = useState({})

    const { loading, error, withLoader } = useLoader()

    const getData = async () => {
        await withLoader(async () => {
            const { data } = await axios.get('http://localhost:8000/api/v1/stats/get-pie-chart-data')
            const { data: pieData } = data
            setPieChart(pieData)
        })

    }

    useEffect(() => {
        getData()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }


    return (
        <div className='flex flex-col justify-center items-center border border-gray-300'>

            <h1 className='text-2xl font-bold text-white mt-5'>Revenue Distribution</h1>
            <DoughnutChart
                labels={["grossIncome", "discount", "marketingCost", "netMargin"]}
                data={[pieChart?.revenueDistribution?.grossIncome, pieChart?.revenueDistribution?.discount, pieChart?.revenueDistribution?.marketingCost, pieChart?.revenueDistribution?.netMargin]}
                color={["#4CAF50", "#FF9800", "#2196F3", "#E91E63"]}

            />

            <h1 className='text-2xl font-bold text-white mt-5'>Order Fullfillment</h1>
            <DoughnutChart
                labels={["pending", "shipped", "delivered", "canceled"]}
                data={[pieChart?.orderFullfillment?.pending, pieChart?.orderFullfillment?.shipped, pieChart?.orderFullfillment?.delivered, pieChart?.orderFullfillment?.canceled]}
                color={["#FF5722", "#8BC34A", "#FFC107", "#9C27B0"]}

            />

            <h1 className='text-2xl font-bold text-white mt-5'>Stock Availability</h1>
            <DoughnutChart
                labels={["inStock", "outOfStock"]}
                data={[pieChart?.stockAvailability?.inStock, pieChart?.stockAvailability?.outOfStock]}
                color={["#03A9F4", "#F44336"]}

            />


        </div>
    )
}

export default AdminCharts
