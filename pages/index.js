import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Grid, List, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  // Sample data - replace with your Excel data later
  const initialData = {
    kpis: [
      {
        id: 1,
        section: "الأنشطة",
        kpiName: "عدد الحملات الإعلامية التي تم تنفيذها",
        value2024: 1,
        value2025: 2,
        improvement: 100.0,
        department: "الإعلام",
        isComplete: true,
        status: "ممتاز"
      },
      {
        id: 2,
        section: "الأنشطة", 
        kpiName: "عدد الفعاليات التي تم تغطيتها إعلاميًا",
        value2024: 2,
        value2025: 4,
        improvement: 100.0,
        department: "الإعلام",
        isComplete: true,
        status: "ممتاز"
      },
      {
        id: 3,
        section: "المخرجات",
        kpiName: "عدد الحملات التسويقية المنفذة",
        value2024: 12,
        value2025: 18,
        improvement: 50.0,
        department: "التسويق",
        isComplete: true,
        status: "ممتاز"
      },
      {
        id: 4,
        section: "النتائج",
        kpiName: "مؤشر رضا العملاء",
        value2024: 85,
        value2025: 82,
        improvement: -3.5,
        department: "السمعة",
        isComplete: true,
        status: "يحتاج تحسين"
      },
      {
        id: 5,
        section: "الأثر",
        kpiName: "عدد الفعاليات الدبلوماسية المنظمة",
        value2024: 8,
        value2025: 12,
        improvement: 50.0,
        department: "التشريفات",
        isComplete: true,
        status: "ممتاز"
      },
      {
        id: 6,
        section: "النتائج",
        kpiName: "معدل التفاعل على وسائل التواصل",
        value2024: 15,
        value2025: 22,
        improvement: 46.7,
        department: "الاتصال",
        isComplete: true,
        status: "ممتاز"
      }
    ],
    departments: ["الإعلام", "التسويق", "السمعة", "التشريفات", "الاتصال"],
    sections: ["الأنشطة", "المخرجات", "النتائج", "الأثر"]
  };

  const [filters, setFilters] = useState({
    department: 'الكل',
    section: 'الكل',
    searchTerm: '',
    showOnlyComplete: false
  });
  
  const [viewMode, setViewMode] = useState('cards');

  const filteredData = useMemo(() => {
    return initialData.kpis.filter(kpi => {
      const matchesDepartment = filters.department === 'الكل' || kpi.department === filters.department;
      const matchesSection = filters.section === 'الكل' || kpi.section === filters.section;
      const matchesSearch = filters.searchTerm === '' || kpi.kpiName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesComplete = !filters.showOnlyComplete || kpi.isComplete;
      
      return matchesDepartment && matchesSection && matchesSearch && matchesComplete;
    });
  }, [filters, initialData.kpis]);

  const departmentSummaries = useMemo(() => {
    return initialData.departments.map(dept => {
      const deptKPIs = initialData.kpis.filter(kpi => kpi.department === dept);
      const completeKPIs = deptKPIs.filter(kpi => kpi.isComplete);
      const avgImprovement = completeKPIs.length > 0 
        ? completeKPIs.reduce((sum, kpi) => sum + kpi.improvement, 0) / completeKPIs.length 
        : 0;
      
      return {
        department: dept,
        totalKPIs: deptKPIs.length,
        completeKPIs: completeKPIs.length,
        avgImprovement: avgImprovement,
        status: avgImprovement > 20 ? 'ممتاز' : avgImprovement > 0 ? 'جيد' : 'يحتاج تحسين'
      };
    });
  }, [initialData]);

  const formatNumber = (num) => new Intl.NumberFormat('ar-EG').format(num);
  const formatPercentage = (num) => {
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const getTrendIcon = (improvement) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getImprovementColor = (improvement) => {
    if (improvement > 10) return 'bg-green-100 text-green-800 border-green-200';
    if (improvement > 0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (improvement < 0) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const KPICard = ({ kpi }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-end text-right mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed">
          {kpi.kpiName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
            {kpi.department}
          </span>
          <span className="text-sm px-2 py-1 bg-blue-100 rounded-full">
            {kpi.section}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">2025</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(kpi.value2025)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">2024</div>
          <div className="text-xl text-gray-600">
            {formatNumber(kpi.value2024)}
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${getImprovementColor(kpi.improvement)}`}>
        {getTrendIcon(kpi.improvement)}
        <span className="font-semibold">
          {formatPercentage(kpi.improvement)}
        </span>
      </div>
    </div>
  );

  const DepartmentSummaryCard = ({ summary, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
      onClick={() => onClick(summary.department)}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{summary.department}</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {summary.totalKPIs}
        </div>
        <div className="text-sm text-gray-500 mb-3">
          مؤشر أداء ({summary.completeKPIs} مكتمل)
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getImprovementColor(summary.avgImprovement)}`}>
          {getTrendIcon(summary.avgImprovement)}
          {formatPercentage(summary.avgImprovement)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة مؤشرات الأداء الرئيسية
              </h1>
              <p className="text-gray-600">النصف الأول من عام 2025</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                <div className="text-sm text-gray-500">مؤشر مرشح</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                القسم
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="الكل">جميع الأقسام</option>
                {initialData.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                المحور
              </label>
              <select
                value={filters.section}
                onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="الكل">جميع المحاور</option>
                {initialData.sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البحث
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في المؤشرات..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Complete Data Toggle */}
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showOnlyComplete}
                  onChange={(e) => setFilters(prev => ({ ...prev, showOnlyComplete: e.target.checked }))}
                  className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">البيانات المكتملة فقط</span>
              </label>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <span className="text-sm text-gray-700 ml-4">طريقة العرض:</span>
            <button
              onClick={() => setViewMode('summary')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'summary' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              ملخص الأقسام
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'cards' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              البطاقات
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              الجدول
            </button>
          </div>
        </div>

        {/* Department Summary View */}
        {viewMode === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {departmentSummaries.map(summary => (
              <DepartmentSummaryCard 
                key={summary.department} 
                summary={summary}
                onClick={(dept) => setFilters(prev => ({ ...prev, department: dept }))}
              />
            ))}
          </div>
        )}

        {/* KPI Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(kpi => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نسبة التحسن
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      2025
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      2024
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المحور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المؤشر
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map(kpi => (
                    <tr key={kpi.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImprovementColor(kpi.improvement)}`}>
                          {getTrendIcon(kpi.improvement)}
                          {formatPercentage(kpi.improvement)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatNumber(kpi.value2025)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {formatNumber(kpi.value2024)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {kpi.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {kpi.department}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={kpi.kpiName}>
                          {kpi.kpiName}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على مؤشرات</h3>
            <p className="text-gray-500">جرب تغيير المرشحات أو مصطلح البحث</p>
          </div>
        )}

      </div>
    </div>
  );
}
