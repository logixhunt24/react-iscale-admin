import React from 'react'
import { Route } from 'react-router-dom'
import withListRow from '../components/common/withListRow'
import OffersList from '../pages/marketing/OffersList'
import BannersList from '../pages/marketing/BannersList'
import AddBanner from '../pages/marketing/AddBanner'
import LeadGenerateList from '../pages/marketing/LeadGenerateList'
import AddLeadGenerate from '../pages/marketing/AddLeadGenerate'
import LeadGeneratePreview from '../pages/marketing/LeadGeneratePreview'
import PublicLeadForm from '../pages/marketing/PublicLeadForm'
import CouponsList from '../pages/marketing/CouponsList'
import AddCoupon from '../pages/marketing/AddCoupon'
import EditCouponPage from '../pages/marketing/EditCoupon'
const EditCoupon = withListRow(EditCouponPage, { endpoint: '/myadmin/coupons/all', stateKey: 'couponData' })
import AddOffer from '../pages/marketing/AddOffer'

const marketingRoutes = {
  public: [
    <Route key="public-lead-form" path="/form/:slug" element={<PublicLeadForm />} />,
    <Route key="lead-generate-preview" path="/leads/preview/:slug" element={<LeadGeneratePreview />} />
  ],
  protected: [
    <Route key="offers" path="/offers" element={<OffersList />} />,
    <Route key="offers-add" path="/offers/add" element={<AddOffer />} />,
    <Route key="offers-edit" path="/offers/edit/:id" element={<AddOffer />} />,
    <Route key="banners" path="/banners" element={<BannersList />} />,
    <Route key="banners-add" path="/banners/add" element={<AddBanner />} />,
    <Route key="banners-edit" path="/banners/edit/:id" element={<AddBanner />} />,
    <Route key="leads" path="/leads" element={<LeadGenerateList />} />,
    <Route key="leads-add" path="/leads/add" element={<AddLeadGenerate />} />,
    <Route key="leads-edit" path="/leads/edit/:id" element={<AddLeadGenerate />} />,
    <Route key="coupons" path="/master/coupons" element={<CouponsList />} />,
    <Route key="coupons-add" path="/master/coupons/add" element={<AddCoupon />} />,
    <Route key="coupons-edit" path="/master/coupons/edit/:id" element={<EditCoupon />} />
  ]
}

export default marketingRoutes
