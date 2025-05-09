package com.project.team91.model;

import java.util.Objects;

public enum TypeName {
    TUBERCULOSIS("Туберкулез"),
    HEPATITIS_B("Гепатіт Б"),
    DIPHTHERIA_TETANUS("Дифтерія-Правець"),
    WHOOPING_COUGH("Кашлюк"),
    POLIOMYELITIS("Поліоміеліт"),
    HIB_INFECTION("Хіб-інфекція"),
    MMR("Кір-Краснуха-Паротит");

    private final String name;

    TypeName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static TypeName getByType(String type) {
        for (TypeName item : TypeName.values()) {
            if (Objects.equals(item.getName().toUpperCase(), type.toUpperCase())) {
                return item;
            }
        }
        return null;
    }
}
