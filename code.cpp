#include <QObject>

class Counter : public QObject
{
    Q_OBJECT

public:
    Counter() { m_value = 0; }

    int value() const { return m_value; }

public slots:
    void setValue(int value);

signals:
    void valueChanged(int newValue);

private:
    int m_value;
};

void Counter::setValue(int value)
{
    if (value != m_value) {
        m_value = value;
        emit valueChanged(value);
    }
}

int main(){
	Counter a, b;
	QObject::connect(&a, SIGNAL(valueChanged(int)), &b, SLOT(setValue(int)));  // this will always look for signals of the specified form sent by object a and will affect the execution of SLOT for object b
	a.setValue(10); //will make a = 10 , emit the change of value then the signal will execute the slot and B's value will also be 10
	b.setValue(20); //since in the connect, the sender is a and the reciever is b, so this will not emit any signal so only value of b will be changed
}

/*
	a = 10, b = 10
	a = 10, b = 20


*/
