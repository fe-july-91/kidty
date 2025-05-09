package com.project.team91.model;

import java.util.Objects;

public enum Gender {
    BOY("Хлопчик"),
    GIRL("Дівчинка");

    private final String genderName;

    Gender(String genderName) {
        this.genderName = genderName;
    }

    public String getGenderName() {
        return genderName;
    }

    public static Gender getByType(String type) {
        for (Gender item : Gender.values()) {
            if (Objects.equals(item.getGenderName(), type)) {
                return item;
            }
        }
        return null;
    }
}
