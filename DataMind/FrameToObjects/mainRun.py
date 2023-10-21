import removeBackground as step1
import cropSingleObject as step2
import cropMultipleObjects as step3

def main():
    step1.removeBackground()
    step2.cropSingleObject()
    step3.cropMultipleObjects()
    return 1


if __name__ == "__main__":
    print(main())
