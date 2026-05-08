function App() {

  const YEAR = 2026;

  const months = [
    { name: 'Styczeń', days: 31 },
    { name: 'Luty', days: 28 },
    { name: 'Marzec', days: 31 },
    { name: 'Kwiecień', days: 30 },
    { name: 'Maj', days: 31 },
    { name: 'Czerwiec', days: 30 },
    { name: 'Lipiec', days: 31 },
    { name: 'Sierpień', days: 31 },
    { name: 'Wrzesień', days: 30 },
    { name: 'Październik', days: 31 },
    { name: 'Listopad', days: 30 },
    { name: 'Grudzień', days: 31 }
  ];

  const services = [
    { name: 'Mycie detailingowe', price: 150 },
    { name: 'Pranie wnętrza', price: 400 },
    { name: 'Korekta 1 etap', price: 800 },
    { name: 'Korekta wieloetapowa', price: 1800 },
    { name: 'Powłoka roczna', price: 700 },
    { name: 'Powłoka ceramiczna 5 lat', price: 2500 },
    { name: 'Czyszczenie skóry', price: 350 },
    { name: 'Folia PPF', price: 3000 }
  ];

  const [search, setSearch] =
    React.useState('');

  const [saved, setSaved] =
    React.useState(() => {

      const data =
        localStorage.getItem(
          'dejavu-pwa-2026'
        );

      return data
        ? JSON.parse(data)
        : {};

    });

  function saveField(key, value) {

    const updated = {
      ...saved,
      [key]: value
    };

    setSaved(updated);

    localStorage.setItem(
      'dejavu-pwa-2026',
      JSON.stringify(updated)
    );

  }

  function getValue(key) {
    return saved[key] || '';
  }

  function toggleService(
    prefix,
    service
  ) {

    const current =
      getValue(prefix + 'services')
      || [];

    let updated = [];

    if (
      current.includes(service.name)
    ) {

      updated = current.filter(
        (s) => s !== service.name
      );

    } else {

      updated = [
        ...current,
        service.name
      ];

    }

    saveField(
      prefix + 'services',
      updated
    );

  }

  function getTotal(prefix) {

    const selected =
      getValue(prefix + 'services')
      || [];

    let total = 0;

    selected.forEach(
      (serviceName) => {

        const found =
          services.find(
            (s) =>
              s.name === serviceName
          );

        if (found) {
          total += found.price;
        }

      }
    );

    const extra = Number(
      getValue(prefix + 'extra')
    );

    if (!isNaN(extra)) {
      total += extra;
    }

    const discount = Number(
      getValue(prefix + 'discount')
    );

    if (!isNaN(discount)) {
      total -= discount;
    }

    return total;

  }

  function getMonthIncome(month) {

    let total = 0;

    for (
      let i = 1;
      i <= month.days;
      i++
    ) {

      total += getTotal(
        YEAR + month.name + i
      );

    }

    return total;

  }

  function getYearIncome() {

    let total = 0;

    months.forEach((month) => {

      total += getMonthIncome(
        month
      );

    });

    return total;

  }

  return (

    <div style={{
      padding: 20,
      fontFamily: 'Arial',
      background: '#f1f5f9',
      minHeight: '100vh'
    }}>

      <div style={{
        background: '#2563eb',
        color: 'white',
        padding: 25,
        borderRadius: 20,
        marginBottom: 30
      }}>

        <h1 style={{
          fontSize: 40,
          marginBottom: 10
        }}>
          Deja Vu Auto Detailing
          {' '}
          {YEAR} 🚗
        </h1>

        <p>
          Mobilna aplikacja CRM
        </p>

        <h2 style={{
          marginTop: 20
        }}>
          Roczny obrót:
          {' '}
          {getYearIncome()} zł
        </h2>

      </div>

      <input
        placeholder="🔍 Szukaj klienta..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: '100%',
          padding: 15,
          borderRadius: 15,
          border: '1px solid #ccc',
          marginBottom: 30,
          fontSize: 18
        }}
      />

      {months.map((month) => (

        <div
          key={month.name}
          style={{
            background: 'white',
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >

          <div style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>

            <h2>
              {month.name}
              {' '}
              {YEAR}
            </h2>

            <strong>
              Obrót:
              {' '}
              {getMonthIncome(month)}
              {' '}
              zł
            </strong>

          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(320px,1fr))',
            gap: 15
          }}>

            {Array.from(
              {
                length: month.days
              },
              (_, i) => {

                const day = i + 1;

                const prefix =
                  YEAR
                  + month.name
                  + day;

                const selected =
                  getValue(
                    prefix
                    + 'services'
                  ) || [];

                const client =
                  getValue(
                    prefix
                    + 'client'
                  );

                if (
                  search &&
                  !client
                    .toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
                ) {
                  return null;
                }

                return (

                  <div
                    key={day}
                    style={{
                      border:
                        '1px solid #ddd',
                      borderRadius: 15,
                      padding: 15,
                      background:
                        '#fafafa'
                    }}
                  >

                    <strong style={{
                      fontSize: 22
                    }}>
                      {day}
                      {' '}
                      {month.name}
                    </strong>

                    <div style={{
                      display: 'flex',
                      flexDirection:
                        'column',
                      gap: 10,
                      marginTop: 15
                    }}>

                      <input
                        placeholder="Klient"
                        value={client}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'client',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <input
                        placeholder="Telefon"
                        value={getValue(
                          prefix
                          + 'phone'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'phone',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <input
                        placeholder="Auto"
                        value={getValue(
                          prefix
                          + 'car'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'car',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <div style={{
                        background:
                          'white',
                        borderRadius:
                          10,
                        padding: 12,
                        border:
                          '1px solid #ddd'
                      }}>

                        <strong>
                          Usługi:
                        </strong>

                        <div style={{
                          marginTop: 10,
                          display: 'flex',
                          flexDirection:
                            'column',
                          gap: 6
                        }}>

                          {services.map(
                            (service) => (

                              <label
                                key={
                                  service.name
                                }
                                style={{
                                  display:
                                    'flex',
                                  justifyContent:
                                    'space-between'
                                }}
                              >

                                <div>

                                  <input
                                    type="checkbox"
                                    checked={selected.includes(
                                      service.name
                                    )}
                                    onChange={() =>
                                      toggleService(
                                        prefix,
                                        service
                                      )
                                    }
                                  />

                                  {' '}
                                  {service.name}

                                </div>

                                <strong>
                                  {
                                    service.price
                                  } zł
                                </strong>

                              </label>

                            )
                          )}

                        </div>

                      </div>

                      <input
                        placeholder="Dopłata"
                        value={getValue(
                          prefix
                          + 'extra'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'extra',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <input
                        placeholder="Rabat"
                        value={getValue(
                          prefix
                          + 'discount'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'discount',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      />

                      <select
                        value={getValue(
                          prefix
                          + 'status'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'status',
                            e.target.value
                          )
                        }
                        style={inputStyle}
                      >

                        <option value="">
                          Status
                        </option>

                        <option>
                          Zarezerwowany
                        </option>

                        <option>
                          W trakcie
                        </option>

                        <option>
                          Zakończony
                        </option>

                      </select>

                      <textarea
                        placeholder="Notatki"
                        value={getValue(
                          prefix
                          + 'notes'
                        )}
                        onChange={(e) =>
                          saveField(
                            prefix
                            + 'notes',
                            e.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          minHeight: 70
                        }}
                      />

                      <div style={{
                        background:
                          '#2563eb',
                        color: 'white',
                        padding: 14,
                        borderRadius:
                          12,
                        fontSize: 22,
                        fontWeight:
                          'bold',
                        textAlign:
                          'center'
                      }}>

                        Razem:
                        {' '}
                        {getTotal(
                          prefix
                        )}
                        {' '}
                        zł

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      ))}

    </div>

  );

}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: '1px solid #ccc',
  fontSize: 15
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);