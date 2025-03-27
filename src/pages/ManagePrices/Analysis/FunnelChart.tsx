import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../../store/languageStore';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';

interface FunnelChartProps {
  totalLeads: number;
  confirmationRate: number;
  deliveryRate: number;
  deliveredOrdersTotal: 0;
  cpl: number;
  product?: any;
}

export function FunnelChart({
  totalLeads,
  confirmationRate,
  deliveryRate,
  deliveredOrdersTotal,
  cpl,
  product,
}: FunnelChartProps) {
  const { t } = useLanguageStore();

  const getCurrencyLogo =
    product.category === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES[product?.country]?.currency : '$';

  const confirmedLeads = Math.round(totalLeads * (Math.round(confirmationRate) / 100));

  const deliveredOrders = useMemo(
    () => Math.round(confirmedLeads * (Math.round(deliveryRate) / 100)),
    [confirmedLeads]
  );

  // Calculate costs and metrics for each stage
  const metrics = {
    leads: {
      cpl: cpl,
      deliveryTime: '1-2 days',
      conversionRate: '100%',
    },
    confirmed: {
      cpl: cpl,
      deliveryTime: '2-3 days',
      conversionRate: `${Math.round(confirmationRate)}%`,
    },
    delivered: {
      cpl: cpl,
      deliveryTime: '3-5 days',
      conversionRate: `${Math.round(deliveryRate)}%`,
    },
  };

  const maxWidth = 1000;
  const confirmedWidth = Math.max((confirmedLeads / totalLeads) * maxWidth, 100);
  const deliveredWidth = Math.max((deliveredOrders / totalLeads) * maxWidth, 50);

  const [hoveredStage, setHoveredStage] = useState<'leads' | 'confirmed' | 'delivered' | null>(
    null
  );

  const checkEcom = useMemo(() => {
    return product.category === 'ECOM_LOCAL';
  }, [product]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold mb-6">{t('Conversion Funnel')}</h3>
      <div className="relative flex flex-col items-center space-y-4 mx-auto max-w-[800px]">
        {/* Left Decorative Funnel */}
        <div className="absolute -left-2 top-0 h-full w-16 opacity-10">
          <div className="relative h-full">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-violet-500 transform skew-x-6"></div>
            <div className="absolute top-1/3 left-2 w-3/4 h-1/3 bg-emerald-500 transform skew-x-6"></div>
            <div className="absolute top-2/3 left-4 w-1/2 h-1/3 bg-blue-500 transform skew-x-6"></div>
          </div>
        </div>

        {/* Right Decorative Funnel */}
        <div className="absolute -right-2 top-0 h-full w-16 opacity-10">
          <div className="relative h-full">
            <div className="absolute top-0 right-0 w-full h-1/3 bg-violet-500 transform -skew-x-6"></div>
            <div className="absolute top-1/3 right-2 w-3/4 h-1/3 bg-emerald-500 transform -skew-x-6"></div>
            <div className="absolute top-2/3 right-4 w-1/2 h-1/3 bg-blue-500 transform -skew-x-6"></div>
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            key="total-leads"
            initial={{ width: 0, opacity: 0, rotateX: -30 }}
            animate={{ width: maxWidth, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative transform-gpu perspective-1000 group"
            onMouseEnter={() => setHoveredStage('leads')}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ maxWidth: '600px' }}
          >
            <div
              className={`bg-gradient-to-br from-violet-500/10 to-violet-500/5 h-28 rounded-lg flex items-center justify-center shadow-lg border border-violet-200 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${
                hoveredStage === 'leads' ? 'scale-105 shadow-xl border-violet-400' : ''
              }`}
            >
              <div className="absolute inset-0 bg-violet-500/5 transform skew-y-6"></div>
              <div className="relative text-center">
                <div className="text-lg font-bold text-violet-900">
                  <div className="flex items-center justify-center gap-2">
                    {t('Total Leads')}
                    <span className="text-sm font-normal text-violet-600">
                      ({metrics.leads.conversionRate})
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-black text-violet-700 mt-1">
                  {totalLeads ? Math.round(totalLeads) : 0}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-violet-600 mt-2">
                  <span className="px-2 py-1 bg-violet-100 rounded-full">
                    {!checkEcom && '$'} {metrics.leads.cpl} {checkEcom && getCurrencyLogo} / lead
                  </span>
                  {/* <span className="px-2 py-1 bg-violet-100 rounded-full">
                    {metrics.leads.deliveryTime}
                  </span> */}
                </div>
              </div>
              <div
                className={`absolute -right-12 top-1/2 -translate-y-1/2 text-violet-600 font-bold transition-all duration-300 ${
                  hoveredStage === 'leads' ? 'scale-110 text-violet-800' : ''
                }`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-lg">100%</span>
                  <span className="text-sm font-medium opacity-75">Base</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="connector-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="h-12 relative"
          >
            <div
              className={`absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-violet-300 to-emerald-300 transition-all duration-300 ${
                hoveredStage ? 'opacity-50' : ''
              }`}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-emerald-200 w-[170px] text-center">
              <span className="text-sm font-semibold text-emerald-700">
                {Math.round(confirmationRate)}% {t('Confirmation Rate')}
              </span>
            </div>
          </motion.div>

          <motion.div
            key="confirmed-leads"
            initial={{ width: 0, opacity: 0, rotateX: -30 }}
            animate={{ width: '450px', opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative transform-gpu perspective-1000 group"
            onMouseEnter={() => setHoveredStage('confirmed')}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ maxWidth: '800px' }}
          >
            <div
              className={`bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 h-28 rounded-lg flex items-center justify-center shadow-lg border border-emerald-200 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${
                hoveredStage === 'confirmed' ? 'scale-105 shadow-xl border-emerald-400' : ''
              }`}
            >
              <div className="absolute inset-0 bg-emerald-500/5 transform skew-y-6"></div>
              <div className="relative text-center">
                <div className="text-lg font-bold text-emerald-900">
                  <div className="flex items-center justify-center gap-2">
                    {t('Confirmed Leads')}
                    <span className="text-sm font-normal text-emerald-600">
                      ({metrics.confirmed.conversionRate})
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700 mt-1">
                  {confirmedLeads ? Math.round(confirmedLeads) : 0}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-emerald-600 mt-2">
                  <span className="px-2 py-1 bg-emerald-100 rounded-full">
                    {!checkEcom && '$'} {metrics.confirmed.cpl} {checkEcom && getCurrencyLogo} /
                    lead
                  </span>
                  {/* <span className="px-2 py-1 bg-emerald-100 rounded-full">
                    {metrics.confirmed.deliveryTime}
                  </span> */}
                </div>
              </div>
              <div
                className={`absolute -right-12 top-1/2 -translate-y-1/2 text-emerald-600 font-bold transition-all duration-300 ${
                  hoveredStage === 'confirmed' ? 'scale-110 text-emerald-800' : ''
                }`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-lg">{Math.round(confirmationRate)}%</span>
                  <span className="text-sm font-medium opacity-75">Rate</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="connector-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-12 relative"
          >
            <div
              className={`absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-emerald-300 to-blue-300 transition-all duration-300 ${
                hoveredStage ? 'opacity-50' : ''
              }`}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-blue-200  w-[170px] text-center">
              <span className="text-sm font-semibold text-blue-700">
                {Math.round(deliveryRate)}% {t('Delivery Rate')}
              </span>
            </div>
          </motion.div>

          <motion.div
            key="delivered-orders"
            initial={{ width: 0, opacity: 0, rotateX: -30 }}
            animate={{ width: '350px', opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="relative transform-gpu perspective-1000 group"
            onMouseEnter={() => setHoveredStage('delivered')}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ maxWidth: '600px' }}
          >
            <div
              className={`bg-gradient-to-br from-blue-500/10 to-blue-500/5 h-28 rounded-lg flex items-center justify-center shadow-lg border border-blue-200 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${
                hoveredStage === 'delivered' ? 'scale-105 shadow-xl border-blue-400' : ''
              }`}
            >
              <div className="absolute inset-0 bg-blue-500/5 transform skew-y-6"></div>
              <div className="relative text-center">
                <div className="text-lg font-bold text-blue-900">
                  <div className="flex items-center justify-center gap-2">
                    {t('Delivered Orders')}
                    <span className="text-sm font-normal text-blue-600">
                      ({metrics.delivered.conversionRate})
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-700 mt-1">
                  {deliveredOrders ? Math.round(deliveredOrders) : 0}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-blue-600 mt-2">
                  <span className="px-2 py-1 bg-blue-100 rounded-full">
                    {!checkEcom && '$'} {metrics.delivered.cpl} {checkEcom && getCurrencyLogo} /
                    lead
                  </span>
                  {/* <span className="px-2 py-1 bg-blue-100 rounded-full">
                    {metrics.delivered.deliveryTime}
                  </span> */}
                </div>
              </div>
              <div
                className={`absolute -right-12 top-1/2 -translate-y-1/2 text-blue-600 font-bold transition-all duration-300 ${
                  hoveredStage === 'delivered' ? 'scale-110 text-blue-800' : ''
                }`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-lg">{Math.round(deliveryRate)}%</span>
                  <span className="text-sm font-medium opacity-75">Rate</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="connector-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-12 relative"
          >
            <div
              className={`absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-emerald-300 to-blue-300 transition-all duration-300 ${
                hoveredStage ? 'opacity-50' : ''
              }`}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-blue-200  w-[170px] text-center">
              <span className="text-sm font-semibold text-blue-700">{t('Cost Per Product')}</span>
            </div>
          </motion.div>

          <motion.div
            key="cpd"
            initial={{ width: 0, opacity: 0, rotateX: -30 }}
            animate={{ width: '300px', opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="relative transform-gpu perspective-1000 group"
            onMouseEnter={() => setHoveredStage('delivered')}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ maxWidth: '600px' }}
          >
            <div
              className={`bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center shadow-lg border border-blue-200 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${
                hoveredStage === 'delivered' ? 'scale-105 shadow-xl border-blue-400' : ''
              }`}
              style={{
                margin: 'auto',
                borderRadius: '10px',
                width: '200px',
                height: '100px',
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              }}
            >
              <div className="absolute inset-0 bg-blue-500/5 transform skew-y-6"></div>
              <div className="relative text-center">
                <div className="text-lg font-bold text-blue-900">
                  <div className="flex items-center justify-center gap-2">{t('CPD')}</div>
                </div>
                <div className="text-3xl font-black text-blue-700 mt-1">
                  {cpl / ((confirmationRate / 100) * (deliveryRate / 100))
                    ? (cpl / ((confirmationRate / 100) * (deliveryRate / 100))).toFixed(1)
                    : 0}
                </div>
              </div>
              <div
                className={`absolute -right-12 top-1/2 -translate-y-1/2 text-blue-600 font-bold transition-all duration-300 ${
                  hoveredStage === 'delivered' ? 'scale-110 text-blue-800' : ''
                }`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-lg">{Math.round(deliveryRate)}%</span>
                  <span className="text-sm font-medium opacity-75">Rate</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
