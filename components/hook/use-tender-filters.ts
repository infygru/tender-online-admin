"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTenderFilters() {
  // Constants for districts and departments
  const districts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupattur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ];

  const departments = [
    "Agriculture Department",
    "Animal Husbandry Department",
    "BC, MBC & Minorities Welfare Department",
    "Commercial Taxes and Registration Department",
    "Co-operation, Food and Consumer Protection Department",
    "Energy Department",
    "Environment and Forests Department",
    "Finance Department",
    "Handlooms, Handicrafts, Textiles and Khadi Department",
    "Health and Family Welfare Department",
    "Higher Education Department",
    "Highways and Minor Ports Department",
    "Home, Prohibition and Excise Department",
    "Housing and Urban Development Department",
    "Industries Department",
    "Information Technology Department",
    "Labour Welfare and Skill Development Department",
    "Law Department",
    "Municipal Administration and Water Supply Department",
    "Planning, Development and Special Initiatives Department",
    "Public Department",
    "Public Works Department",
    "Revenue and Disaster Management Department",
    "Rural Development and Panchayat Raj Department",
    "School Education Department",
    "Social Welfare and Women Empowerment Department",
    "Tamil Development and Information Department",
    "Tourism, Culture and Religious Endowments Department",
    "Transport Department",
    "Youth Welfare and Sports Development Department",
  ];

  // States
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTenderValues, setSelectedTenderValues] = useState<string[]>(
    []
  );
  const [industry, setIndustry] = useState<string[]>([]);
  const [classification, setClassification] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchList, setSearchList] = useState<string[]>([]);
  const [filterIndustry, setFilterIndustry] = useState<any>([]);
  const [filterClassification, setFilterClassification] = useState<any>([]);
  const [filterSubIndustry, setFilterSubIndustry] = useState<any>([]);
  const [suggestionIndustry, setSuggestionIndustry] = useState<string[]>([]);
  const [suggestionClassification, setSuggestionClassification] = useState<
    string[]
  >([]);

  // Fetch suggestions
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/suggestion/check",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      const { suggestion } = response.data;
      setSuggestionIndustry(suggestion?.industry || []);
      setSuggestionClassification(suggestion?.classification || []);
      return suggestion;
    },
  });

  // Fetch industries
  const { data: industries, isLoading: isLoadingIndustries } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/industries"
      );
      setFilterIndustry(response.data.industries);
      return response.data.industries;
    },
  });

  const { data: classifications, isLoading: isLoadingClassifications } =
    useQuery({
      queryKey: ["classifications"],
      queryFn: async () => {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/classifications"
        );
        setFilterClassification(response.data.classifications);
        return response.data.classifications;
      },
    });

  // Fetch sub-industries
  const { data: subIndustries, isLoading: isLoadingSubIndustries } = useQuery({
    queryKey: ["subIndustries"],
    queryFn: async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/sub-industries"
      );
      setFilterSubIndustry(response.data.subIndustries);
      return response.data.subIndustries;
    },
  });

  const buildQueryParams = useCallback(() => {
    const queryParams = new URLSearchParams();

    const appendMultiSelect = (key: string, values: any[]) => {
      if (values.length) {
        const isObjectWithValue =
          values[0] && typeof values[0] === "object" && "value" in values[0];
        const valueString = isObjectWithValue
          ? values.map((item) => item.value).join(",")
          : values.join(",");
        queryParams.append(key, valueString);
      }
    };

    appendMultiSelect("district", selectedDistricts);
    appendMultiSelect("tenderValue", selectedTenderValues);
    appendMultiSelect("industry", industry);
    appendMultiSelect("classification", classification ? [classification] : []);

    if (searchList.length) {
      queryParams.append("search", searchList.join(","));
    }

    if (dateRange?.startDate && dateRange?.endDate) {
      queryParams.append("startDate", dateRange.startDate.toISOString());
      queryParams.append("endDate", dateRange.endDate.toISOString());
    }

    return queryParams;
  }, [
    selectedDistricts,
    selectedTenderValues,
    industry,
    classification,
    searchList,
    dateRange,
  ]);

  return {
    districts,
    departments,
    selectedDistricts,
    setSelectedDistricts,
    selectedTenderValues,
    setSelectedTenderValues,
    industry,
    setIndustry,
    classification,
    setClassification,
    dateRange,
    setDateRange,
    searchList,
    setSearchList,
    filterIndustry,
    filterSubIndustry,
    buildQueryParams,
    isLoadingIndustries,
    isLoadingSubIndustries,
    suggestionIndustry,
    suggestionClassification,
    setSuggestionIndustry,
    setSuggestionClassification,
    setFilterClassification,
    filterClassification,
    isLoadingClassifications,
  };
}
